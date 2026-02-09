import type { Request, Response } from "express";
import prisma from "../prismaClient";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";

/**
 * Describes identifying information about the game emitting telemetry events.
 * This metadata is persisted alongside each event for querying, analytics,
 * and backward compatibility across game versions.
 */
interface GameInfo {
  /** Human-readable game name (e.g. "SpaceRacer") */
  name: string;

  /** Type/genre of the game (e.g. "RPG", "Racing", etc.) */
  type: string;

  /** Semantic or build version of the game client */
  version: string;
}

/**
 * Metadata envelope for all telemetry events.
 * This object is required and validated before event ingestion.
 */
interface EventMetaData {
  /** Unique identifier for the event (client-generated UUID) */
  id: string;

  /** Logical event name or category (e.g. "level_completed") */
  eventType: string;

  /** Contextual information about the emitting game */
  gameInfo: GameInfo;

  /** UTC timestamp indicating when the event occurred on the client */
  timeStamp: Date;
}

/**
 * Ingests telemetry events sent from game clients.
 *
 * Responsibilities:
 * - Authenticate incoming requests using a pre-shared telemetry key (PSK)
 * - Validate and extract event metadata and payload
 * - Persist the event to the database via Prisma
 * - Handle and normalize known database errors
 *
 * Expected request shape:
 * {
 *   metaData: EventMetaData,
 *   eventPayload: <JSON containing game specific event information>
 * }
 *
 * Authentication:
 * - Requires `X-Telemetry-Key` header to be present
 *
 * Responses:
 * - 401: Missing or invalid telemetry key
 * - 400: Invalid request payload or schema validation failure
 * - 500: Unexpected server error
 */
export async function ingestEvents(req: Request, res: Response) {
  // Pre-shared key used to authenticate telemetry ingestion requests
  const PSK = req.headers["X-Telemetry-Key"];

  if (!PSK) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Extract and normalize request payload
  const metaData: EventMetaData = req.body.metaData;
  const gameInfo: GameInfo = metaData.gameInfo;
  const eventPayload = req.body.eventPayload;

  try {
    // Persist telemetry event to the database
    await prisma.gameEvent.create({
        data: {
            id: metaData.id,
            eventType: metaData.eventType,
            timestamp: metaData.timeStamp,
            gameName: gameInfo.name,
            gameType: gameInfo.type,
            gameVersion: gameInfo.version,
            payload: eventPayload,
        },
    });

    // Successful ingestion
    return res.status(201).json({ status: "Event ingested" });
  } catch (error) {
    // Prisma schema or data validation errors (malformed input)
    if (error instanceof PrismaClientValidationError) {
        return res.status(400).json({ errorMessage: error.message });
    }

    // Known Prisma request errors (e.g. constraint violations)
    if (error instanceof PrismaClientKnownRequestError) {
        return res.status(500).json({ errorMessage: `Database error ${error.code}` });
    }

    // Fallback for unhandled errors
    return res.status(500).json({ errorMessage: "Internal server error" });
  }
}
