import { View, Text, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { last_comment } from './store';
import { C, F, L } from '#/commonStyles/style-layout';
import { Header } from '#/components/common';
import { formatDate3 } from '#/Utils';

const LastComment = ({ navigation }) => {
    const dispatch = useDispatch();
    const responseDataDashboard = useSelector(state => state?.dashboard);



    useEffect(() => {
        dispatch(last_comment())
    }, [])

    console.log('responseDataDashboard?.lastComment', responseDataDashboard);
    return (
        <View style={[L.f1]}>
            <Header
                label_center="Last Comments"
                navigation={navigation}
                showDrawer={true}
            />

            <FlatList
                data={responseDataDashboard?.comments || []}
                keyExtractor={(item, index) => index.toString()}
                refreshing={responseDataDashboard?.isLoading || false}
                onRefresh={() => dispatch(last_comment())}
                renderItem={({ item }) => (
                    <View style={[L.p10, L.bB,L.m10,L.bR10,L.card2]}>
                        <Text style={[L.mB5,C.fcBlack]}>{item?.notes}-{formatDate3(item?.createdAt)}</Text>
                        <Text style={[F.fsOne9, C.fcBlack]}>{item?.contact?.name} - {item?.contact?.phone}</Text>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <View style={[L.aiC, L.jcC, L.f1, L.mT20]}>
                        <Text style={[L.cGray]}>No comments available</Text>
                    </View>
                )}
            />
        </View>
    )
}

export default LastComment