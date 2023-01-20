import React, { useState } from 'react';
import { Alert, Image, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MasonryFlashList } from '@shopify/flash-list';
import Octicons from '@expo/vector-icons/Octicons';
import { useInfiniteQuery } from 'react-query';
import { signOut, User } from 'firebase/auth';
import { connect } from 'react-redux';
import Toast from 'react-native-toast-message';
import { RootStackScreenProps } from '../types';
import { normalize } from '../utils';
import Logo from '../components/Logo';
import Card from '../components/Card';
import { axios } from '../utils';
import { auth } from '../config/firebase';
import { RootState } from '../store';

interface IHomeProps extends RootStackScreenProps<'Home'> {
  user: User | undefined;
  favorites: string[];
}

const MAX_GIPHY_LIMIT = 50;

const Home = ({ navigation, user, favorites }: IHomeProps) => {
  const [hasMore, setHasMore] = useState<boolean>(true);
  const { data, status, error, refetch, hasNextPage, fetchNextPage } = useInfiniteQuery<GiphyResObject>(
    'trending-gifs',
    async ({ pageParam = 1 }) => {
      const data = (
        await axios.get('/gifs/trending', {
          params: {
            limit: MAX_GIPHY_LIMIT,
            offset: pageParam,
          },
        })
      ).data;
      if (data.data.length < MAX_GIPHY_LIMIT) setHasMore(false);
      return data;
    },
    {
      getNextPageParam: (previousPage) => {
        let offset = +previousPage?.pagination?.offset;
        offset = offset !== 1 ? offset : 0;
        if (isNaN(offset) && !offset) return undefined;
        if (offset + MAX_GIPHY_LIMIT < 4999) return offset + MAX_GIPHY_LIMIT;
        return offset;
      },
    },
  );

  if (status === 'error') {
    Toast.show({
      type: 'error',
      text1: 'Something went wrong',
      text2: (error as Error)?.message || 'An error occurred while processing your request :(',
    });
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: normalize(10), paddingHorizontal: normalize(14) }}>
      <View style={styles.header}>
        <Logo style="dark" />

        <TouchableOpacity
          style={styles.avatarWrapper}
          activeOpacity={0.8}
          onPress={() => {
            if (!user?.email) return signOut(auth);
            Alert.alert(user.email, undefined, [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Sign Out', onPress: () => signOut(auth) },
            ]);
          }}
        >
          <Image style={styles.avatar} source={{ uri: `https://api.dicebear.com/5.x/fun-emoji/png?seed=${user?.uid}` }} resizeMode="contain" />
        </TouchableOpacity>
      </View>

      {/* // TODO: search input */}
      {/* <View style={{ width: '100%' }}></View> */}

      <MasonryFlashList
        data={data?.pages.flatMap((page) => page.data)}
        numColumns={2}
        renderItem={({ item, columnIndex }) => {
          const isFavorite = favorites.includes(item.id);
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
        refreshControl={<RefreshControl refreshing={status === 'loading'} onRefresh={refetch} title="Pull to refresh" tintColor="#000" titleColor="#000" />}
        onEndReachedThreshold={0.2}
        onEndReached={hasNextPage ? fetchNextPage : undefined}
      />

      <TouchableOpacity style={styles.fab} activeOpacity={0.7} onPress={() => navigation.navigate('Favorite')}>
        <Octicons name="heart-fill" size={normalize(14)} />
      </TouchableOpacity>

      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

const mapStateToProps = (state: RootState) => ({ user: state.auth.user, favorites: state.favorite.items.map(({ id }) => id) });
export default connect(mapStateToProps, null)(Home);

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: normalize(10),
  },
  avatarWrapper: {
    aspectRatio: 1,
    height: normalize(30),
    width: normalize(30),
    borderRadius: 9999,
    overflow: 'hidden',
    shadowColor: 'rgba(0,0,0,.4)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  avatar: {
    height: '100%',
    width: '100%',
  },
  fab: {
    aspectRatio: 1,
    position: 'absolute',
    right: normalize(15),
    bottom: normalize(15),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: normalize(45),
    backgroundColor: '#FFF',
    borderRadius: 9999,
    shadowColor: 'rgba(0,0,0,.4)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
});
