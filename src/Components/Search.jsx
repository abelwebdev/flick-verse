/* eslint-disable no-unused-vars */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSearchClicked) {
      const isSearchQueryEmpty = searchQuery.trim() === '';
      if (isSearchQueryEmpty) {
        alert('Please enter a search query');
        setIsSearchClicked(false); // Reset the trigger after running search
        setSearchQuery('');
      } else {
        setIsSearchClicked(false); // Reset the trigger after running search
        navigate(`/search/${searchQuery}`);
      }
    }
  }, [isSearchClicked, navigate, searchQuery]);

  return (
    <div>
      <Form className="d-flex" onSubmit={(e) => {
        e.preventDefault();
        setIsSearchClicked(true); // Trigger search on form submission
      }}>
        <Form.Control
          type="search"
          placeholder="Search"
          className="me-2"
          aria-label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
          <Button variant="success" type="submit" onClick={() => setIsSearchClicked(true)}>Search</Button>
        </Form>
    </div>
  )
}

export default Search