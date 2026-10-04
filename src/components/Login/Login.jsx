import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .nonempty("Zod:Password is required")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain upper, lower, number, and special character"
    ),
});

export default function Login() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { handleSubmit, register, formState } = useForm({
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  function myHandleSubmit(data) {
    setIsLoading(true);
    console.log("Data...", data);

    axios
      .post(`https://route-posts.routemisr.com/users/signin`, data)
      .then((res) => {
        console.log("✅ Success:", res.data.message);
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      })
      .catch((err) => {
        setIsSuccess(false);
        setErrorMessage(err.response.data.message);
        console.error("❌ Error:", err.response.data.message);
        setTimeout(() => {
          setErrorMessage(null);
        }, 2000);
      })
      .finally(() => {
        setIsLoading(false);

        console.log("Request completed.");
      });
  }

  console.log(formState.errors);
  return (
    <>
      <h2 className="font-bold text-4xl text-center">Login Now</h2>

      {errorMessage && (
        <div className="bg-red-500 text-center">
          <p>{errorMessage}</p>
        </div>
      )}
      {isSuccess && (
        <div className="bg-green-500 text-center">
          <p>Welcome Back</p>
        </div>
      )}
      <form onSubmit={handleSubmit(myHandleSubmit)} className="px-20 py-5">
        <div className="mb-3">
          <label htmlFor="userEmail">Email</label>
          <input
            {...register("email")}
            type="email"
            id="userEmail"
            placeholder="Enter Your Email"
            className="block w-full border-2 p-1.5 rounded-lg"
          />
          {formState.errors.email && formState.touchedFields.email && (
            <p className="text-red-700">{formState.errors.email?.message}</p>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="userPassword">Password</label>
          <input
            {...register("password")}
            type="password"
            id="userPassword"
            placeholder="Enter Your Password"
            className="block w-full border-2 p-1.5 rounded-lg"
          />

          {formState.errors.password && (
            <p className="text-red-700">{formState.errors.password?.message}</p>
          )}
        </div>

        <button className="border-2  px-10 py-2 rounded-2xl cursor-pointer bg-gradient-to-bl bg-blue-700 hover:bg-white hover:text-blue-800 duration-75">
          {isLoading ? <BeatLoader /> : "Login"}
        </button>
      </form>
    </>
  );
}
