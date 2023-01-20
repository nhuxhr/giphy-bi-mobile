import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import Octicons from '@expo/vector-icons/Octicons';
import * as Animatable from 'react-native-animatable';
import { normalize } from '../utils';
import { RootStackScreenProps } from '../types';
import { useAppDispatch } from '../hooks/redux';
import { addFavorite, removeFavorite } from '../store/reducers/favorite';

const Detail = ({ navigation, route }: RootStackScreenProps<'Detail'>) => {
  const item = useState(route.params.item)[0];
  const [isFavorite, setIsFavorite] = useState(route.params.isFavorite);
  const aspectRatio = useState(+item.images.original.width / +item.images.original.height || 1)[0];
  const dispatch = useAppDispatch();

  const handleFavorite = () => {
    dispatch(!isFavorite ? addFavorite(item) : removeFavorite(item.id));
    navigation.setParams({ isFavorite: !isFavorite });
  };

  useEffect(() => {
    setIsFavorite(() => route.params.isFavorite);
  }, [route.params.isFavorite]);

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: normalize(2), paddingHorizontal: normalize(14) }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.8} onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={normalize(18)} color="#00000066" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.8} onPress={handleFavorite}>
          <Octicons name="heart-fill" size={normalize(14)} color={!isFavorite ? '#0000004d' : '#D41F3A'} />
        </TouchableOpacity>
      </View>

      <Animatable.View animation="fadeInUp" style={{ aspectRatio, width: '100%', borderRadius: normalize(10), overflow: 'hidden' }}>
        <Image
          style={{
            height: '100%',
            width: '100%',
            borderRadius: normalize(10),
          }}
          source={{ uri: `https://media0.giphy.com/media/${item.id}/giphy.gif` }}
          resizeMode="contain"
        />
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={100} style={{ position: 'relative', marginTop: normalize(10) }}>
        <Text style={{ color: '#000' }}>{item.title}</Text>
      </Animatable.View>
    </SafeAreaView>
  );
};

export default Detail;

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: normalize(10),
  },
  headerBtn: {
    padding: normalize(6),
  },
});
