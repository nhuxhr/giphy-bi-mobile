import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Octicons from '@expo/vector-icons/Octicons';
import * as Animatable from 'react-native-animatable';
import { useAppDispatch } from '../hooks/redux';
import { normalize } from '../utils';
import { addFavorite, removeFavorite } from '../store/reducers/favorite';

interface ICardProps {
  column: number;
  item: GiphyGIFObject;
  isFavorite: boolean;
  onPress: () => void;
}

const Card = ({ column, item, isFavorite, onPress }: ICardProps) => {
  const aspectRatio = useState(+item.images.original.width / +item.images.original.height || 1)[0];
  const dispatch = useAppDispatch();

  return (
    <TouchableOpacity
      style={{
        position: 'relative',
        aspectRatio,
        width: '96%',
        alignSelf: column ? 'flex-end' : undefined,
        backgroundColor: '#FFF',
        borderRadius: normalize(8),
        overflow: 'hidden',
        shadowColor: 'rgba(0,0,0,.5)',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
      }}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Animatable.View animation="fadeIn">
        <Image
          style={{
            height: '100%',
            width: '100%',
            borderRadius: normalize(8),
          }}
          source={{ uri: `https://media0.giphy.com/media/${item.id}/giphy_s.gif` }}
          resizeMode="contain"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            paddingVertical: normalize(10),
            paddingHorizontal: normalize(8),
          }}
        >
          <Text style={{ color: '#FFF' }} numberOfLines={2}>
            {item.title}
          </Text>
        </LinearGradient>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            margin: normalize(10),
          }}
          activeOpacity={0.8}
          onPress={() => dispatch(!isFavorite ? addFavorite(item) : removeFavorite(item.id))}
        >
          <Octicons name="heart-fill" size={normalize(14)} color={!isFavorite ? '#FFF' : '#D41F3A'} />
        </TouchableOpacity>
      </Animatable.View>
    </TouchableOpacity>
  );
};

export default Card;
