import React, { useState, useCallback } from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '#/components/Icons';
import debounce from 'lodash/debounce';
import CommonFlatList from './CommonFlatlist';
import { Loader } from './index';

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
  const ref = React.createRef();

  const handleSearch = useCallback(
    debounce((query) => {
      // Call the parent's search handler with the query
      onSearchChange?.(query);
    }, debounceTime),
    [onSearchChange]
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
        dataSource={data}
        _renderItems={renderItem}
        _keyExtractor={(item, index) => String(item.id || item.assignmentId || index)}
        _listEmptyComponent={data?.length===0 && ListEmptyComponent}
        onEndReachedThreshold={0.5} 
        onRefresh={onRefresh}
        _pagingEnabled={pagingEnabled}
        onEndReached={()=>{
          // Always allow pagination - let the parent component handle the logic
          onEndReached?.();
        }}
        _listFooterComponent={refreshing && <Loader />} 
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