import express from "express";
import createAccount from "../controllers/user-controller.js";
import RegisterSchema from "../validation-schema/register-schema.js";

const router = express.Router();

router.post("/", RegisterSchema, createAccount);

export default router;
