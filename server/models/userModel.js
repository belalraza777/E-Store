import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
            maxlength: [50, "Name must be at most 50 characters"],
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],

        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        phone: {
            type: String,
            unique: true,
            trim: true,
            match: [/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"],
        },

        passwordHash: {
            type: String,
            required: function () {
                return this.provider === "local";
            },
            select: false,
            minlength: [6, "Password must be at least 6 characters"],
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },

        avatar: { type: String },

        address: {
            address: { type: String, trim: true, lowercase: true },
            city: { type: String, trim: true, lowercase: true },
            postalCode: { type: String, trim: true, lowercase: true },
            country: { type: String, trim: true, lowercase: true },
        },

        isBlocked: {
            type: Boolean,
            default: false,
        },
        provider: {
            type: String,
            enum: ["local", "google", "facebook"],
            default: "local",
        },
        providerId: String,
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
