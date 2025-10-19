import { View, Text, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { last_comment } from './store';
import { last_lead_comment } from '#/screens/Leads/store';
import { C, F, L } from '#/commonStyles/style-layout';
import { Header } from '#/components/common';
import { formatDate3 } from '#/Utils';

const LastComment = ({ navigation }) => {
    const dispatch = useDispatch();
    const responseDataDashboard = useSelector(state => state?.dashboard);
    const responseDataLeads = useSelector(state => state?.leads);
    const appMode = useSelector(state => state?.app?.mode || 'data');

    // Choose the appropriate data source based on mode
    const responseData = appMode === 'leads' ? responseDataLeads : responseDataDashboard;

    useEffect(() => {
        if (appMode === 'leads') {
            dispatch(last_lead_comment());
        } else {
            dispatch(last_comment());
        }
    }, [appMode])

    console.log('responseData?.comments', responseData);
    return (
        <View style={[L.f1]}>
            <Header
                label_center={appMode === 'leads' ? 'Last Lead Comments' : 'Last Comments'}
                navigation={navigation}
                showDrawer={true}
            />

            <FlatList
                data={responseData?.comments || []}
                keyExtractor={(item, index) => index.toString()}
                refreshing={responseData?.isLoading || false}
                onRefresh={() => {
                    if (appMode === 'leads') {
                        dispatch(last_lead_comment());
                    } else {
                        dispatch(last_comment());
                    }
                }}
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