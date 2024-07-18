import express from "express";
import { LoginSchema } from "../validation-schema/login-schema.js";
import createAccessToken from "../controllers/access-token-controller.js";

const router = express.Router();

router.post("/access-token", LoginSchema, createAccessToken);

export default router;
