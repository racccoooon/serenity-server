import {pool} from "../db/index.js";
import {logger} from "../utils/logger.js";

export async function cleanupSessions() {
    logger.info("Starting session cleanup cron.");
    await pool.query(`delete from sessions where valid_until < now()`);
    logger.info("Session cleanup cron succeeded.");
}