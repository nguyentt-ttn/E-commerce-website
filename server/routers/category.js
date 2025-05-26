const express = require('express');
const categoryRoutes = express.Router();
const categoryController = require('../controllers/category');

categoryRoutes.post('/categories', categoryController.createCategory);
categoryRoutes.get('/categories', categoryController.getAllCategories);
categoryRoutes.get('/categories/:slug', categoryController.getCategoryBySlug);
categoryRoutes.put('/categories/:id', categoryController.updateCategory);
categoryRoutes.delete('/categories/:id', categoryController.deleteCategory);

module.exports = categoryRoutes;
