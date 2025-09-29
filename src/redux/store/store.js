import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../Slice/userSlice";
import aboutReducer from "../Slice/aboutSlice";
import educationReducer from "../Slice/educationSlice";
import experienceReducer from "../Slice/experienceSlice";
import techStackReducer from "../Slice/techStackSlice";
import projectReducer from "../Slice/projectSlice";
import contactReducer from "../Slice/contactSlice";
import messageReducer from "../Slice/messageSlice";
import awardsReducer from "../Slice/awardSlice";
import testimonialsReducer from "../Slice/testimonialSlice";
const store = configureStore({
  reducer: {
    user: userReducer,
    about: aboutReducer,
    education: educationReducer,
    experience: experienceReducer,
    techStack: techStackReducer, 
    project: projectReducer, 
    contact : contactReducer  ,
    message : messageReducer,
    awards :awardsReducer,
    testimonials: testimonialsReducer,
    
  },
});

export default store;
