import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import { GET_PHOTOS } from '../api/queries';
import {
  setImages,
  toggleLike,
  setLoading,
  setError,
} from '../store/slices/gallerySlice';
import { RootState } from '../store';
import HeartAnimation from '../components/HeartAnimation';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import AppColors from '../theme/AppColors';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width / 2 - 15;

type GalleryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Gallery'
>;

interface Props {
  navigation: GalleryScreenNavigationProp;
}

const GalleryScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { images, likedImageIds, loading, error } = useSelector(
    (state: RootState) => state.gallery,
  );

  const {
    data,
    loading: apiLoading,
    error: apiError,
    refetch,
  } = useQuery(GET_PHOTOS, {
    variables: { options: { paginate: { page: 1, limit: 20 } } },
  });

  useEffect(() => {
    dispatch(setLoading(apiLoading));
    if (apiError) dispatch(setError(apiError.message));
    if (data?.photos?.data) {
      dispatch(setImages(data.photos.data));
    }
  }, [data, apiLoading, apiError, dispatch]);

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleLike = (id: string) => {
    dispatch(toggleLike(id));
  };

  const fixPlaceholderUrl = (url: string, id: string) => {
    // picsum.photos is much more reliable and provides high-quality images
    return `https://picsum.photos/seed/${id}/400/400`;
  };

  const renderItem = ({ item }: { item: any }) => {
    const isLiked = likedImageIds.includes(item.id);
    const imageUrl = fixPlaceholderUrl(item.thumbnailUrl, item.id);
    console.log('Rendering item with URL:', imageUrl);

    return (
      <View style={styles.card}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Details', { imageId: item.id })}
        >
          <FastImage
            source={{
              uri: imageUrl,
              priority: FastImage.priority.normal,
            }}
            style={styles.image}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.imageTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <TouchableOpacity
              style={styles.likeButton}
              onPress={() => handleLike(item.id)}
            >
              <HeartAnimation isLiked={isLiked} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading && images.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>Loading images...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContent: {
    padding: 12,
  },
  card: {
    width: COLUMN_WIDTH,
    margin: 6,
    backgroundColor: AppColors.white,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: COLUMN_WIDTH * 1.2,
    backgroundColor: AppColors.divider,
  },
  infoContainer: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppColors.white,
  },
  imageTitle: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
    color: AppColors.text,
    textTransform: 'capitalize',
  },
  likeButton: {
    padding: 4,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: AppColors.icon,
    fontWeight: '500',
  },
  errorText: {
    color: AppColors.error,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: AppColors.primary,
    borderRadius: 12,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  retryText: {
    color: AppColors.white,
    fontWeight: '700',
    fontSize: 16,
  },
});

export default GalleryScreen;
