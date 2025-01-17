import { AuditAction, AuditEntity } from "@prisma/client";
import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { AuditLogRepository } from "../repositories/auditLog.repository";
import { BookingRepository } from "../repositories/booking.repository";
import { AuditLogUseCase, BookingUseCase } from "../usecases";
import AppError from "../utils/errorHandling";

const router = Router();
const bookingRepository = new BookingRepository();
const bookingUseCase = new BookingUseCase(bookingRepository);

const auditLogRepository = new AuditLogRepository();
const auditLogUseCase = new AuditLogUseCase(auditLogRepository);

// GET /bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await bookingRepository.listBookings();

    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(400).json({
      error:
        error instanceof Error ? error.message : "An unknown error occurred.",
    });
  }
});

// GET /bookings/:bookingId
router.get("/:bookingId", async (req, res) => {
  const { bookingId } = req.params;

  try {
    const booking = await bookingRepository.findBookingById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found." });
    }

    return res.status(200).json(booking);
  } catch (error) {
    return res.status(400).json({
      error:
        error instanceof Error ? error.message : "An unknown error occurred.",
    });
  }
});

// GET /bookings/user/:userId
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const bookings = await bookingUseCase.findBookingByUser(userId);

    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(400).json({
      error:
        error instanceof Error ? error.message : "An unknown error occurred.",
    });
  }
});

// POST /bookings
router.post("/", isAuthenticated, async (req: any, res) => {
  const { userId, roomId, date, startTime, endTime, description } = req.body;

  if (!userId || !roomId || !date || !startTime || !endTime) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const booking = await bookingUseCase.createBooking({
      userId,
      roomId,
      date: new Date(date),
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      description,
    });

    await auditLogUseCase.createAuditLog({
      userId,
      action: AuditAction.CREATE,
      entity: AuditEntity.BOOKING,
      entityId: booking.id,
    });

    return res.status(201).json({ message: "Booking created." });
  } catch (error) {
    const { code, message, statusCode } = error as AppError;

    return res.status(statusCode).json({ code, message, statusCode });
  }
});

// PUT /bookings/:bookingId
router.put("/:bookingId", isAuthenticated, async (req: any, res) => {
  const { bookingId } = req.params;
  const { userId, roomId, date, startTime, endTime, description } = req.body;

  if (!userId && !roomId && !date && !startTime && !endTime && !description) {
    return res.status(400).json({ error: "At least one field is required." });
  }

  try {
    const booking = await bookingUseCase.updateBooking(bookingId, {
      userId,
      roomId,
      date: new Date(date),
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      description,
    });

    const response = {
      message: "Booking updated.",
      booking,
    };

    await auditLogUseCase.createAuditLog({
      userId,
      action: AuditAction.UPDATE,
      entity: AuditEntity.BOOKING,
      entityId: booking.id,
    });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      error:
        error instanceof Error ? error.message : "An unknown error occurred.",
    });
  }
});

// DELETE /bookings/:bookingId
router.delete("/:bookingId", isAuthenticated, async (req: any, res) => {
  const { bookingId } = req.params;

  try {
    const booking = await bookingUseCase.deleteBooking(bookingId);

    const response = {
      message: "Booking deleted.",
      booking,
    };

    const { id: performedBy } = req.user;

    await auditLogUseCase.createAuditLog({
      userId: performedBy,
      action: AuditAction.DELETE,
      entity: AuditEntity.BOOKING,
      entityId: booking.id,
    });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      error:
        error instanceof Error ? error.message : "An unknown error occurred.",
    });
  }
});

// PUT /bookings/:bookingId/cancel
router.put("/:bookingId/cancel", isAuthenticated, async (req: any, res) => {
  const { bookingId } = req.params;
  const { id: userId } = req.user;

  try {
    const booking = await bookingUseCase.cancelBooking(bookingId, userId);

    const response = {
      message: "Booking cancelled successfully.",
      booking,
    };

    await auditLogUseCase.createAuditLog({
      userId,
      action: AuditAction.UPDATE,
      entity: AuditEntity.BOOKING,
      entityId: booking.id,
    });

    return res.status(200).json(response);
  } catch (error) {
    const { code, message, statusCode } = error as AppError;

    return res.status(statusCode).json({ code, message, statusCode });
  }
});

// PUT /bookings/:bookingId/complete
router.put("/:bookingId/complete", isAuthenticated, async (req: any, res) => {
  const { bookingId } = req.params;
  const { id: userId } = req.user;

  try {
    const booking = await bookingUseCase.completeBooking(bookingId, userId);

    const response = {
      message: "Booking completed successfully.",
      booking,
    };

    await auditLogUseCase.createAuditLog({
      userId,
      action: AuditAction.UPDATE,
      entity: AuditEntity.BOOKING,
      entityId: booking.id,
    });

    return res.status(200).json(response);
  } catch (error) {
    const { code, message, statusCode } = error as AppError;

    return res.status(statusCode).json({ code, message, statusCode });
  }
});

export default router;
