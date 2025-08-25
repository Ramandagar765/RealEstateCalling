import React, { useState, useCallback } from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '#/components/Icons';
import debounce from 'lodash/debounce';
import CommonFlatList from './CommonFlatlist';
import Spinner from './Spinner';

const SearchableList = ({
  data,
  searchEnable = true,                  
  searchFields,           
  renderItem,
  pagingEnabled = false,             
  searchPlaceholder = 'Search...', 
  searchBarStyle,         
  listContainerStyle,     
  debounceTime = 300,     
  ListEmptyComponent,     
  ListHeaderComponent,    
  onSearchChange,
  refreshing,
  onRefresh,
  onEndReached,
  hasMore,
  ...flatListProps        
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const ref = React.createRef();

  React.useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const defaultFilter = useCallback((items, query) => {
    if (!query.trim()) return items;
    
    return items.filter(item => {
      return searchFields?.some(field => {
        const fieldPath = field.split('.');
        let value = item;
        
        for (const key of fieldPath) {
          if (!value || !value[key]) return false;
          value = value[key];
        }
        
        return String(value).toLowerCase().includes(query.toLowerCase());
      });
    });
  }, [searchFields]);

  const handleSearch = useCallback(
    debounce((query) => {
      const filtered = defaultFilter(data, query);
      setFilteredData(filtered);
      onSearchChange?.(query, filtered);
    }, debounceTime),
    [data, defaultFilter, onSearchChange]
  );

  const onChangeText = (text) => {
    setSearchQuery(text);
    handleSearch(text);
  };

  const clearSearch = () => {
    setSearchQuery('');
    handleSearch('');
  };

 

  return (
    <View style={[styles.container, listContainerStyle]}>
      {searchEnable && <View style={[styles.searchBar, searchBarStyle]}>
        <Ionicons name="search-outline" size={18} color="black" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChangeText={onChangeText}
          placeholderTextColor="#999"
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={clearSearch} style={styles.clearButton}>
            <Ionicons name="close-circle" size={18} color="#999" />
          </Pressable>
        )}
      </View> }
      <CommonFlatList 
        dataSource={filteredData}
        _renderItems={renderItem}
        _keyExtractor={(item, index) => String(item.id || index)}
        _listEmptyComponent={filteredData?.length===0 && ListEmptyComponent}
        onEndReachedThreshold={0.5} 
        onRefresh={onRefresh}
        _pagingEnabled={pagingEnabled}
        onEndReached={()=>{
          if(filteredData?.length >= 8) {
            onEndReached?.();
          }
        }}
        _listFooterComponent={refreshing && <Spinner isLoading={refreshing} text='Hold on Loading More'/>} 
        {...flatListProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10, 
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: '#BEBEBE',
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    height: 45,
  },
  clearButton: {
    padding: 4,
  }
});

export default SearchableList;
