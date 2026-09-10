import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cinematix';

const updatePosters = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Assuming we have Movie model, let's just use raw collection to avoid importing model
    const moviesCollection = mongoose.connection.collection('movies');

    await moviesCollection.updateOne(
      { title: /coco/i },
      { $set: { poster: '/uploads/posters/coco.webp' } }
    );
    await moviesCollection.updateOne(
      { title: /tangled/i },
      { $set: { poster: '/uploads/posters/tangled.webp' } }
    );
    await moviesCollection.updateOne(
      { title: /luca/i },
      { $set: { poster: '/uploads/posters/luca.webp' } }
    );
    await moviesCollection.updateOne(
      { title: /raya and the last dragon/i },
      { $set: { poster: '/uploads/posters/raya and the last dragon.webp' } }
    );
    await moviesCollection.updateOne(
      { title: /aladdin|aladin/i },
      { $set: { poster: '/uploads/posters/aladin.webp' } }
    );
    
    // Zootopia 2 isn't in the webp list, we can leave it as is.
    // Also Monsters Inc can be set to the mounster.jpg
    await moviesCollection.updateOne(
      { title: /monsters, inc./i },
      { $set: { poster: '/uploads/posters/mounster.jpg' } }
    );

    console.log('✅ Posters updated successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Update error:', err);
    process.exit(1);
  }
};

updatePosters();
