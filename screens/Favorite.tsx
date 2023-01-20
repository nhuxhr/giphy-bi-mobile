import { MasonryFlashList } from '@shopify/flash-list';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import Card from '../components/Card';
import { RootState } from '../store';
import { RootStackScreenProps } from '../types';
import { normalize } from '../utils';

interface IFavoriteProps extends RootStackScreenProps<'Favorite'> {
  favorites: GiphyGIFObject[];
}

const Favorite = ({ navigation, favorites }: IFavoriteProps) => {
  return (
    <SafeAreaView style={{ flex: 1, paddingTop: normalize(10), paddingHorizontal: normalize(14) }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorite</Text>
      </View>

      <MasonryFlashList
        data={favorites}
        numColumns={2}
        renderItem={({ item, columnIndex }) => {
          const isFavorite = true;
          return (
            <Card
              key={item.id}
              column={columnIndex}
              item={item}
              isFavorite={isFavorite}
              onPress={() => {
                navigation.navigate('Detail', { item, isFavorite });
              }}
            />
          );
        }}
        estimatedItemSize={15000}
        ItemSeparatorComponent={() => <View style={{ margin: normalize(5) }} />}
        contentContainerStyle={{ paddingBottom: normalize(10) }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const mapStateToProps = (state: RootState) => ({ favorites: state.favorite.items });
export default connect(mapStateToProps, null)(Favorite);

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: normalize(10),
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    alignSelf: 'center',
  },
});
