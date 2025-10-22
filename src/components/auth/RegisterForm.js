"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { registerUser } from "../../lib/api";

export default function RegisterForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    console.log("RegisterForm - Submitted data:", data);

    setIsLoading(true);
    setError("");

    try {
      await registerUser({
        username: data.username,
        password: data.password,
      });
      console.log("RegisterForm - Registration successful");
    } catch (err) {
      console.error("RegisterForm - Registration error:", err);
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          id="username"
          type="text"
          {...register("username", { required: "Username is required" })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          {...register("password", { required: "Password is required" })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 text-white bg-blue-500 rounded-md"
      >
        {isLoading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}