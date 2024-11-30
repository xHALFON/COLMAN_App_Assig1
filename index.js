import express from 'express';
import { connectDB } from './utils/db.js';
import bodyParser from 'body-parser';
import commentRoutes from './routes/commentRoutes.js';
import postRoutes from './routes/postRoutes.js';
import authRoutes from './routes/authRoutes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './swaggerConfig.js';

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/post', postRoutes);
app.use('/comments', commentRoutes);
app.use('/auth', authRoutes);

export default app;

if (process.env.NODE_ENV !== 'test') {
  connectDB();
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
