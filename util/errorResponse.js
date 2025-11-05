//error function for server side errors
export const serverErrorResponse = (err, res) => {
  return res.status(500).json({
    success: false,
    message: err.message || "Something went wrong!",
    data: null
  })
}

//error function for client side issues
export const clientErorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data: null
  })


}