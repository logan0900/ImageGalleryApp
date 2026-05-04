import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useQuery } from '@apollo/client';
import { GET_PHOTO_DETAILS } from '../api/queries';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import AppColors from '../theme/AppColors';
import { getDeviceInfo } from '../native/DeviceDetails';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

interface Props {
  route: DetailsScreenRouteProp;
}

const DetailsScreen: React.FC<Props> = ({ route }) => {
  const { imageId } = route.params;
  const { data, loading, error } = useQuery(GET_PHOTO_DETAILS, {
    variables: { id: imageId },
  });
  const [deviceInfo, setDeviceInfo] = useState<any>(null);

  const imageScale = useSharedValue(0.8);
  const imageOpacity = useSharedValue(0);

  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        const info = await getDeviceInfo();
        setDeviceInfo(info);
      } catch (e) {
        console.error(e);
      }
    };
    fetchDeviceData();

    imageScale.value = withSpring(1);
    imageOpacity.value = withSpring(1);
  }, []);

  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: imageScale.value }],
      opacity: imageOpacity.value,
    };
  });

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error || !data?.photo) {
    return (
      <View style={styles.centered}>
        <Text>Error loading details</Text>
      </View>
    );
  }

  const fixPlaceholderUrl = (url: string, id: string) => {
    return `https://picsum.photos/seed/${id}/800/800`;
  };

  const { photo } = data;
  const imageUrl = fixPlaceholderUrl(photo.url, photo.id);

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={[styles.imageContainer, animatedImageStyle]}>
        <FastImage
          source={{
            uri: imageUrl,
            priority: FastImage.priority.high,
          }}
          style={styles.image}
          resizeMode={FastImage.resizeMode.cover}
        />
      </Animated.View>

      <View style={styles.content}>
        <Text style={styles.title}>{photo.title}</Text>
        <Text style={styles.author}>
          By {photo.album?.user?.name || 'Unknown Author'}
        </Text>
        <Text style={styles.likes}>
          ❤️ {Math.floor(Math.random() * 1000) + 100} Likes
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            This is a high-quality image titled "{photo.title}" which was
            uploaded to the gallery. It represents the artistic vision of the
            creator and is part of our curated collection.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Device Information (Native Bridge)
          </Text>
          {deviceInfo ? (
            <View style={styles.deviceInfoContainer}>
              <Text style={styles.deviceText}>Brand: {deviceInfo.brand}</Text>
              <Text style={styles.deviceText}>Model: {deviceInfo.model}</Text>
              <Text style={styles.deviceText}>
                OS: {deviceInfo.systemName} {deviceInfo.osVersion}
              </Text>
            </View>
          ) : (
            <Text>Loading device info...</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.white,
  },
  imageContainer: {
    width: width,
    height: width * 1.1,
    backgroundColor: AppColors.divider,
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    padding: 24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: AppColors.white,
    marginTop: -32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: AppColors.text,
    marginBottom: 8,
    letterSpacing: -0.5,
    textTransform: 'capitalize',
  },
  author: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.primary,
    marginBottom: 6,
  },
  likes: {
    fontSize: 16,
    color: AppColors.secondary,
    fontWeight: '700',
    marginBottom: 24,
  },
  section: {
    marginTop: 12,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: AppColors.divider,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: AppColors.gray700,
    lineHeight: 26,
    fontWeight: '400',
  },
  deviceInfoContainer: {
    backgroundColor: AppColors.background,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  deviceText: {
    fontSize: 15,
    color: AppColors.gray700,
    marginBottom: 8,
    fontWeight: '500',
  },
});

export default DetailsScreen;
