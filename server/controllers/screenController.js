import asyncHandler from 'express-async-handler';
import Screen from '../models/Screen.js';

export const getScreensByCinema = asyncHandler(async (req, res) => {
  const screens = await Screen.find({ cinemaId: req.params.cinemaId });
  res.json(screens);
});

export const getScreenById = asyncHandler(async (req, res) => {
  const screen = await Screen.findById(req.params.id).populate('cinemaId', 'name');
  if (screen) res.json(screen);
  else { res.status(404); throw new Error('Screen not found'); }
});

export const createScreen = asyncHandler(async (req, res) => {
  const screen = new Screen(req.body);
  await screen.save();
  res.status(201).json(screen);
});

export const updateScreen = asyncHandler(async (req, res) => {
  const screen = await Screen.findById(req.params.id);
  if (screen) {
    Object.assign(screen, req.body);
    await screen.save();
    res.json(screen);
  } else { res.status(404); throw new Error('Screen not found'); }
});

export const deleteScreen = asyncHandler(async (req, res) => {
  const screen = await Screen.findById(req.params.id);
  if (screen) { await screen.deleteOne(); res.json({ message: 'Screen removed' }); }
  else { res.status(404); throw new Error('Screen not found'); }
});
