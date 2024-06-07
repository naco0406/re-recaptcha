// /app/components/CategorySelector.tsx
import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Button } from '@mui/material';
import { fetchCategories, addCategory, Category } from '../api/firebaseService';
import CustomBreadcrumb from './Breadcrumb';

interface CategorySelectorProps {
  selectedCategory: {
    major: string;
    mid: string;
    minor: string;
  };
  selectedCategoryNames: {
    major: string;
    mid: string;
    minor: string;
  };
  onCategoryChange: (type: 'major' | 'mid' | 'minor', id: string, name: string) => void;
  allowAddNew?: boolean;  // 새로운 카테고리를 추가할 수 있는 옵션을 제어
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  selectedCategoryNames,
  onCategoryChange,
  allowAddNew = false
}) => {
  const [majors, setMajors] = useState<Category[]>([]);
  const [mids, setMids] = useState<Category[]>([]);
  const [minors, setMinors] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({ type: '', name: '', parentId: '' });

  useEffect(() => {
    const fetchMajorCategories = async () => {
      const majorCategories = await fetchCategories('major');
      setMajors(majorCategories);
    };
    fetchMajorCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory.major) {
      const fetchMidCategories = async () => {
        const midCategories = await fetchCategories('mid', selectedCategory.major);
        setMids(midCategories);
      };
      fetchMidCategories();
    }
  }, [selectedCategory.major]);

  useEffect(() => {
    if (selectedCategory.mid) {
      const fetchMinorCategories = async () => {
        const minorCategories = await fetchCategories('minor', selectedCategory.mid);
        setMinors(minorCategories);
      };
      fetchMinorCategories();
    }
  }, [selectedCategory.mid]);

  const handleCategoryChange = (event: SelectChangeEvent, type: 'major' | 'mid' | 'minor') => {
    const selectedCategory = event.target.value as string;
    const selectedCategoryName = (event.target as HTMLElement).innerText;
    onCategoryChange(type, selectedCategory, selectedCategoryName);
  };

  const handleAddCategory = async () => {
    const categoryId = await addCategory({
        type: newCategory.type as 'major' | 'mid' | 'minor',
        name: newCategory.name,
        parentId: newCategory.parentId
    });

    if (newCategory.type === 'major') {
      setMajors([...majors, { id: categoryId, name: newCategory.name, type: 'major' }]);
      onCategoryChange('major', categoryId, newCategory.name);
    } else if (newCategory.type === 'mid') {
      setMids([...mids, { id: categoryId, name: newCategory.name, type: 'mid', parentId: newCategory.parentId }]);
      onCategoryChange('mid', categoryId, newCategory.name);
    } else if (newCategory.type === 'minor') {
      setMinors([...minors, { id: categoryId, name: newCategory.name, type: 'minor', parentId: newCategory.parentId }]);
      onCategoryChange('minor', categoryId, newCategory.name);
    }

    setNewCategory({ type: '', name: '', parentId: '' });
  };

  return (
    <div>
      <CustomBreadcrumb
        selectedCategoryNames={selectedCategoryNames}
        onCategoryChange={onCategoryChange}
      />
      <FormControl fullWidth style={{ marginBottom: '16px' }}>
        <InputLabel>대분류</InputLabel>
        <Select
          value={selectedCategory.major}
          onChange={(e) => handleCategoryChange(e, 'major')}
        >
          {majors.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
          {allowAddNew && <MenuItem value="addNewMajor">대분류 추가</MenuItem>}
        </Select>
      </FormControl>

      {allowAddNew && selectedCategory.major === 'addNewMajor' && (
        <div style={{ marginBottom: '16px' }}>
          <TextField
            label="새로운 대분류"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value, type: 'major' })}
            fullWidth
          />
          <Button onClick={handleAddCategory} variant="contained" color="primary" fullWidth>추가</Button>
        </div>
      )}

      <FormControl fullWidth style={{ marginBottom: '16px' }}>
        <InputLabel>중분류</InputLabel>
        <Select
          value={selectedCategory.mid}
          onChange={(e) => handleCategoryChange(e, 'mid')}
          disabled={!selectedCategory.major || selectedCategory.major === 'addNewMajor'}
        >
          {mids.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
          {allowAddNew && <MenuItem value="addNewMid">중분류 추가</MenuItem>}
        </Select>
      </FormControl>

      {allowAddNew && selectedCategory.mid === 'addNewMid' && (
        <div style={{ marginBottom: '16px' }}>
          <TextField
            label="새로운 중분류"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value, type: 'mid', parentId: selectedCategory.major })}
            fullWidth
          />
          <Button onClick={handleAddCategory} variant="contained" color="primary" fullWidth>추가</Button>
        </div>
      )}

      <FormControl fullWidth style={{ marginBottom: '16px' }}>
        <InputLabel>소분류</InputLabel>
        <Select
          value={selectedCategory.minor}
          onChange={(e) => handleCategoryChange(e, 'minor')}
          disabled={!selectedCategory.mid || selectedCategory.mid === 'addNewMid'}
        >
          {minors.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
          {allowAddNew && <MenuItem value="addNewMinor">소분류 추가</MenuItem>}
        </Select>
      </FormControl>

      {allowAddNew && selectedCategory.minor === 'addNewMinor' && (
        <div style={{ marginBottom: '16px' }}>
          <TextField
            label="새로운 소분류"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value, type: 'minor', parentId: selectedCategory.mid })}
            fullWidth
          />
          <Button onClick={handleAddCategory} variant="contained" color="primary" fullWidth>추가</Button>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
