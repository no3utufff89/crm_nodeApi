import { knex } from "../connectDataBase.js";

export const createCategory = async (req, res) => {
    console.log(req.body);
    
    try {
        const { 
            category_title, 
            category_description = '', 
            category_image = 'No Image',
            category_isActive = false,
        } = req.body;

        if (! category_title) {
            return res.status(400).json({ error: 'Missing required field' });
        }

        const category = await knex('category')
            .insert(
                {
                    category_title:  category_title,
                    category_description:  category_description,
                    category_image:  category_image,
                    category_isActive:  category_isActive
                })
            .returning('*');

        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    
};

export const getCategories = async (req, res) => {
    try {
        const categories = await knex('category');
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

