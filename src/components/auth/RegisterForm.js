"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { registerUser } from "../../lib/api";

export default function RegisterForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");

    try {
      await registerUser({
        username: data.username,
        password: data.password,
      });

      // Redirect to login page after successful registration
      router.push("/auth/login?registered=true");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Create an Account</h1>
        <p className="mt-2 text-gray-600">Join BucketList and start organizing your tasks!</p>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-800 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            id="username"
            type="text"
            {...register("username", { required: "Username is required" })}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.username && (
            <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password", { required: "Password is required" })}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}