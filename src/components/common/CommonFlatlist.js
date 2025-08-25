import React from 'react';
import { FlatList } from 'react-native';

export default class CommonFlatList extends React.Component {
    static defaultProps = {
        refreshing: false,
        numOfColumns: 1,
        // nestedScrollEnabled: true,
    };
    constructor(props) {
        super(props);
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        const propNamesToCheck = ['dataSource', 'canEdit'];
        return propNamesToCheck.some((prop) => this.props[prop] !== nextProps[prop]);
    }

    render() {
        const {
            dataSource,
            refreshing,
            onRefresh,
            onEndReached,
            thresoldValue,
            _renderItems,
            _keyExtractor,
            _horizontal,
            _scrollEnable,
            parentStyle,
            _nestedScrollEnabled,
            _extraData,
            _viewabilityConfig,
            _onViewableItemsChanged,
            _onScrollEndDrag,
            _numOfColumns,
            _key,
            _contentContainerStyle,
            _listHeaderComponent,
            _listFooterComponent,
            _listEmptyComponent,
            _bounces,
            _snapToInterval,
            _pagingEnabled,
            ref,
            _decelerationRate,
            _disableIntervalMomentum,
            _updateCellsBatchingPeriod,
            _windowSize,
            _columnWrapperStyle,
            _initialScrollIndex,
            _itemSeparatorComponent,
            onMomentumScrollBegin,
            _stickyHeaderIndices
        } = this.props;

        return (
            <FlatList
                ref={ref}
                data={dataSource}
                bounces={_bounces}
                contentContainerStyle={_contentContainerStyle}
                extraData={_extraData}
                snapToInterval={_snapToInterval}
                onScrollEndDrag={_onScrollEndDrag}
                keyExtractor={_keyExtractor}
                style={[parentStyle]}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                refreshing={refreshing}
                onRefresh={onRefresh}
                onMomentumScrollBegin={onMomentumScrollBegin}
                disableIntervalMomentum={_disableIntervalMomentum}
                decelerationRate={_decelerationRate}
                pagingEnabled={_pagingEnabled}
                onEndReached={onEndReached}
                onEndReachedThreshold={thresoldValue}
                horizontal={_horizontal}
                scrollEnabled={_scrollEnable}
                windowSize={_windowSize}
                nestedScrollEnabled={_nestedScrollEnabled}
                renderItem={_renderItems}
                updateCellsBatchingPeriod={_updateCellsBatchingPeriod}
                viewabilityConfig={_viewabilityConfig}
                onViewableItemsChanged={_onViewableItemsChanged}
                numColumns={_numOfColumns}
                key={_key}
                ItemSeparatorComponent={_itemSeparatorComponent}
                initialScrollIndex={_initialScrollIndex}
                columnWrapperStyle={_columnWrapperStyle}
                ListEmptyComponent={_listEmptyComponent}
                ListHeaderComponent={_listHeaderComponent}
                ListFooterComponent={_listFooterComponent}
                stickyHeaderIndices={_stickyHeaderIndices}
            />
        );
    }
}