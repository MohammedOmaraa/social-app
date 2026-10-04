import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // const [userNameValue, setuserNameValue] = useState("Ali");

  // function handleSubmit(e) {
  //   // document.querySelector("#userName")
  //   e.preventDefault();
  //   console.log("Hello");
  // }
  // function handleChange(e) {
  //   console.log(e.target.value);
  //   setuserNameValue(e.target.value);
  // }

  const schema = z
    .object({
      name: z
        .string()
        .nonempty("Zod:Name is required")
        .min(3, "Name must be at least 3 characters"),
      email: z.string().email("Invalid email format"),
      password: z
        .string()
        .nonempty("Zod:Password is required")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          "Password must contain upper, lower, number, and special character"
        ),
      rePassword: z.string(),
      dateOfBirth: z.coerce
        .date({
          required_error: "Date of birth is required",
          invalid_type_error: "Invalid date format",
        })
        .refine((data) => {
          return new Date().getFullYear() - data.getFullYear() >= 18
            ? true
            : false;
        }, "age must be over 18")
        .transform(
          (dateObj) =>
            `${dateObj.getDate()}-${
              dateObj.getMonth() + 1
            }-${dateObj.getFullYear()}`
        ),
      gender: z.enum(["male", "female"], {
        invalid_type_error: "Gender invalid",
        required_error: "Gender is required",
      }),
    })
    .refine((data) => data.password == data.rePassword, {
      message: "Passwords do not match",
      path: ["rePassword"],
    });

  const { handleSubmit, register, formState, setError, getValues, watch } =
    useForm({
      // defaultValues: {
      //   name: "Ali",
      //   email: "test@gmail.com",
      //   password: "ali",
      //   rePassword: "",
      //   gender: "female",
      // },
      mode: "onChange",
      resolver: zodResolver(schema),
    });

  // function myHandleSubmit(data) {
  //   console.log("Data...", data);
  //   // if (data.password == data.rePassword) {
  //   // call BE
  //   axios
  //     .post(`https://linked-posts.routemisr.com/users/signup`, data)
  //     .then((res) => {
  //       console.log("res:-", res.data);
  //     })
  //     .catch((err) => {
  //       console.error("❌ Error:", err);
  //       if (err.response?.data?.message) {
  //         // مثال على خطأ من السيرفر مثل "Email already exists"
  //         alert(err.response.data.message);
  //       } else {
  //         alert("Something went wrong, please try again.");
  //       }
  //     });
  //   // } else {
  //   // setError("rePassword", { message: "repassword not as password" });
  //   // }
  // }
  function myHandleSubmit(data) {
    setIsLoading(true);
    console.log("Data...", data);

    axios
      .post(`https://route-posts.routemisr.com/users/signup`, data)
      .then((res) => {
        console.log("✅ Success:", res.data);
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      })
      .catch((err) => {
        setIsSuccess(false);
        setErrorMessage(err.res.data.error);
        console.error("❌ Error:", err);
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
      <h2 className="font-bold text-4xl text-center">Register Now</h2>

      {errorMessage && (
        <div className="bg-red-500 text-center">
          <p>{errorMessage}</p>
        </div>
      )}
      {isSuccess && (
        <div className="bg-green-500 text-center">
          <p>Success</p>
        </div>
      )}
      <form onSubmit={handleSubmit(myHandleSubmit)} className="px-20 py-5">
        <div className="mb-3">
          <label htmlFor="userName">Name</label>
          <input
            // onChange={handleChange}
            // value={userNameValue}
            {...register(
              "name"
              //   {
              //   required: { value: true, message: "name is repuired" },
              //   minLength: {
              //     value: 3,
              //     message: "user name must be at least 3 char",
              //   },
              //   maxLength: {
              //     value: 15,
              //     message: "maximum length must be 15 char",
              //   },
              // }
            )}
            type="text"
            id="userName"
            placeholder="Enter Your Name"
            className="block w-full border-2 p-1.5 rounded-lg"
          />
          {formState.errors.name && formState.touchedFields.name && (
            <p className="text-red-700">{formState.errors.name?.message}</p>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="userEmail">Email</label>
          <input
            {...register(
              "email"
              //   {
              //   required: { value: true, message: "email is repuired" },
              //   pattern: {
              //     // value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
              //     message: "email not valid",
              //   },
              // }
            )}
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
            {...register(
              "password"
              //    {
              //   required: { value: true, message: "email is repuired" },
              //   validate: function (value) {
              //     console.log(value);
              //     if (value.includes("@")) {
              //       return true;
              //     }
              //     return "password invalid";
              //   },
              // }
            )}
            type="password"
            id="userPassword"
            placeholder="Enter Your Password"
            className="block w-full border-2 p-1.5 rounded-lg"
          />

          {formState.errors.password && (
            <p className="text-red-700">{formState.errors.password?.message}</p>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="user-rePassword">Re-Password</label>
          <input
            {...register("rePassword")}
            type="password"
            id="user-rePassword"
            placeholder="Enter Your Re-Password"
            className="block w-full border-2 p-1.5 rounded-lg"
          />
          {formState.errors.rePassword && (
            <p className="text-red-700">
              {formState.errors.rePassword?.message}
            </p>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="user-dateOfBirth">Date Of Birth</label>
          <input
            {...register(
              "dateOfBirth"
              //   {
              //   valueAsDate: true,
              //   validate: function (value) {
              //     console.log("value of date ", value);
              //     const currentYear = new Date().getFullYear();
              //     if (currentYear - value.getFullYear() >= 18) {
              //       return true;
              //     }
              //     return "age must over 17";
              //   },
              // }
            )}
            type="date"
            id="user-dateOfBirth"
            className="block w-full border-2 p-1.5 rounded-lg"
          />
          {formState.errors.dateOfBirth && (
            <p className="text-red-700">
              {formState.errors.dateOfBirth?.message}
            </p>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="male">Male</label>
          <input
            {...register(
              "gender"
              //    {
              //   required: { value: true, message: "gender is repuired" },
              // }
            )}
            value={"male"}
            type="radio"
            id="male"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="female">Female</label>
          <input
            {...register("gender")}
            value={"female"}
            type="radio"
            id="female"
          />
        </div>

        <button className="border-2  px-10 py-2 rounded-2xl cursor-pointer bg-gradient-to-bl bg-blue-700 hover:bg-white hover:text-blue-800 duration-75">
          {/* using when fun is async */}
          {/* {formState.isSubmitted ? <BeatLoader /> : "Register"} */}
          {isLoading ? <BeatLoader /> : "Register"}
        </button>
      </form>
    </>
  );
}
