import { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import config from "../config.json";
import axios from "axios";

const ProductForm = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    ingredients: "",
    categoryId: "", // Updated to store the selected category ID
    defaultPrice: "",
    salesPrice: "",
    productImage: null,
    requiredOptions: [{ name: "", choice: "", required: false }],
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get(`${config.apiUrl}/product-categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    }
    fetchCategories();
  }, []);

  const handleChange = (e, index) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      const newOptions = [...formData.requiredOptions];
      newOptions[index][name] = checked;
      setFormData({ ...formData, requiredOptions: newOptions });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleOptionChange = (e, index) => {
    const { name, value } = e.target;
    const newOptions = [...formData.requiredOptions];
    newOptions[index][name] = value;
    setFormData({ ...formData, requiredOptions: newOptions });
  };

  const addOption = () => {
    setFormData({
      ...formData,
      requiredOptions: [
        ...formData.requiredOptions,
        { name: "", choice: "", required: false },
      ],
    });
  };

  const removeOption = (index) => {
    const newOptions = [...formData.requiredOptions];
    newOptions.splice(index, 1);
    setFormData({ ...formData, requiredOptions: newOptions });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData({ ...formData, productImage: reader.result });
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/products", {
        ...formData,
        productImage: formData.productImage,
      });

      if (response.status === 200) {
        const data = response.data;
        console.log("Product created successfully:", data);
      } else {
        console.error("Failed to create product:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating product:", error.message);
    }
  };

  return (
    <Container>
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Form onSubmit={handleSubmit}>
            {/* Product Name */}
            <Form.Group controlId="formName">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                name="name"
                value={formData.name}
                onChange={(e) => handleChange(e)}
              />
            </Form.Group>

            {/* Product Description */}
            <Form.Group controlId="formDescription">
              <Form.Label>Product Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter product description"
                name="description"
                value={formData.description}
                onChange={(e) => handleChange(e)}
              />
            </Form.Group>

            {/* Product Ingredients */}
            <Form.Group controlId="formIngredients">
              <Form.Label>Product Ingredients</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product ingredients"
                name="ingredients"
                value={formData.ingredients}
                onChange={(e) => handleChange(e)}
              />
            </Form.Group>

            {/* Product Category ID */}
            <Form.Group controlId="formCategoryId">
              <Form.Label>Product Category</Form.Label>
              <Form.Control
                as="select"
                name="categoryId"
                value={formData.categoryId}
                onChange={(e) => handleChange(e)}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            {/* Default Price */}
            <Form.Group controlId="formDefaultPrice">
              <Form.Label>Default Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter default price"
                name="defaultPrice"
                value={formData.defaultPrice}
                onChange={(e) => handleChange(e)}
              />
            </Form.Group>

            {/* Sales Price */}
            <Form.Group controlId="formSalesPrice">
              <Form.Label>Sales Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter sales price"
                name="salesPrice"
                value={formData.salesPrice}
                onChange={(e) => handleChange(e)}
              />
            </Form.Group>

            {/* Product Image */}
            <Form.Group controlId="formProductImage">
              <Form.Label>Product Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                name="productImage"
                onChange={handleImageChange}
              />
            </Form.Group>

            {/* Required Options */}
            <Form.Group controlId="formRequiredOptions">
              <Form.Label>Required Options</Form.Label>
              {formData.requiredOptions.map((option, index) => (
                <div key={index} className="d-flex mb-2">
                  <Form.Control
                    type="text"
                    placeholder="Option Name"
                    name="name"
                    value={option.name}
                    onChange={(e) => handleOptionChange(e, index)}
                  />
                  <Form.Control
                    type="text"
                    placeholder="Option Choice"
                    name="choice"
                    value={option.choice}
                    onChange={(e) => handleOptionChange(e, index)}
                  />
                  <Form.Check
                    type="checkbox"
                    label="Required"
                    name="required"
                    checked={option.required}
                    onChange={(e) => handleChange(e, index)}
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeOption(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button variant="primary" size="sm" onClick={addOption}>
                Add Option
              </Button>
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductForm;
