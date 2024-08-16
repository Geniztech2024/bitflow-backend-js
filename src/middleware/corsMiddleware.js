import cors from 'cors';

// Allow all origins
const corsOptions = {
  origin: '*',  // Allows all origins (for development purposes)
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,  // Allows credentials to be included in requests (optional)
  optionsSuccessStatus: 204
};

// Apply the CORS middleware with the options
app.use(cors(corsOptions));
