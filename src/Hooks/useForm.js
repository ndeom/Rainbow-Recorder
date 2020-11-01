import React, { useState, useEffect } from "react";

const useForm = (callback, inputs) => {
    const handleSubmit = (event) => {
        if (event) event.preventDefault();
        callback(...inputs);
    };
    return null;
};

export default useForm;
