import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { C, L, F } from '#/commonStyles/style-layout';
import { formatDate3 } from '#/Utils';

const DOT_SIZE = 14;
const LINE_LEFT = 8;

const Timeline = ({ notes = [], title = 'Notes' }) => {
  const hasNotes = Array.isArray(notes) && notes.length > 0;

  return (
    <View style={[L.mT10]}>
      <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB10]}>{title}:</Text>

      {!hasNotes && (
        <Text style={[F.fsOne4, C.fcLightGray, F.ffM, L.mL20]}>No notes available</Text>
      )}

      {hasNotes && (
          <FlatList
            data={notes}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: 20 }} // optional spacing
            renderItem={({ item, index }) => (
              <View style={[styles.rowContainer]}>
                {/* Dot + Line */}
                <View style={styles.dotContainer}>
                  <View style={[styles.dotOuter, { borderColor: C.colorPrimary }]}>
                    <View style={[styles.dotInner, { backgroundColor: C.colorPrimary }]} />
                  </View>
                  {index !== notes.length - 1 && (
                    <View style={[styles.verticalLine, { backgroundColor: C.colorPrimary }]} />
                  )}
                </View>

                {/* Note Content */}
                <View style={[L.f1, L.mL10]}>
                  <Text style={[F.fsOne4, C.fcGray, F.ffM, styles.noteText]}>
                    {item?.note || 'No note content'}
                  </Text>
                  <Text style={[F.fsOne2, C.fcLightGray, F.ffM]}>
                    {item?.createdAt ? formatDate3(item.createdAt) : 'No date'}
                  </Text>
                </View>
              </View>
            )}
          />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    position: 'relative',
  },
  dotContainer: {
    width: 24,
    alignItems: 'center',
    position: 'relative',
    marginBottom: -10
  },
  dotOuter: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    zIndex: 1,
  },
  dotInner: {
    width: DOT_SIZE / 2,
    height: DOT_SIZE / 2,
    borderRadius: DOT_SIZE / 4,
    backgroundColor: '#D4D4D8',
  },
  verticalLine: {
    position: 'absolute',
    top: DOT_SIZE + 1, // push below dot
    width: 2,
    height: '100%',
  },
  noteText: {
    marginBottom: 4,
  },
});

export default Timeline;
