import { Request, Response } from 'express';
import Currency, { ICurrency } from '../models/Currency';

// @desc    Get all currencies
// @route   GET /api/currencies
// @access  Public
export const getCurrencies = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const currencies = await Currency.find().sort({ code: 1 });
    res.json(currencies);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get currency by code
// @route   GET /api/currencies/:code
// @access  Public
export const getCurrencyByCode = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const currency = await Currency.findOne({
      code: req.params.code.toUpperCase(),
    });
    if (!currency) {
      res.status(404).json({ message: 'Currency not found' });
      return;
    }
    res.json(currency);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create currency
// @route   POST /api/currencies
// @access  Private/Admin
export const createCurrency = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { code, name, symbol } = req.body;

    // Check if currency already exists
    const existingCurrency = await Currency.findOne({
      code: code.toUpperCase(),
    });
    if (existingCurrency) {
      res.status(400).json({ message: 'Currency already exists' });
      return;
    }

    // Create currency
    const currency = new Currency({
      code: code.toUpperCase(),
      name,
      symbol,
    });

    const createdCurrency = await currency.save();
    res.status(201).json(createdCurrency);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update currency
// @route   PUT /api/currencies/:code
// @access  Private/Admin
export const updateCurrency = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, symbol } = req.body;

    const currency = await Currency.findOne({
      code: req.params.code.toUpperCase(),
    });
    if (!currency) {
      res.status(404).json({ message: 'Currency not found' });
      return;
    }

    // Update currency
    currency.name = name || currency.name;
    currency.symbol = symbol || currency.symbol;

    const updatedCurrency = await currency.save();
    res.json(updatedCurrency);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete currency
// @route   DELETE /api/currencies/:code
// @access  Private/Admin
export const deleteCurrency = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const currency = await Currency.findOne({
      code: req.params.code.toUpperCase(),
    });
    if (!currency) {
      res.status(404).json({ message: 'Currency not found' });
      return;
    }

    await currency.deleteOne();
    res.json({ message: 'Currency removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
