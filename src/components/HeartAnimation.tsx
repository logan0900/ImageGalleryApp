import React, { useEffect } from 'react';
import { Heart } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import AppColors from '../theme/AppColors';

interface HeartAnimationProps {
  isLiked: boolean;
  onAnimationComplete?: () => void;
}

const HeartAnimation: React.FC<HeartAnimationProps> = ({
  isLiked,
  onAnimationComplete,
}) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isLiked) {
      scale.value = withSequence(
        withSpring(1.5),
        withSpring(1, {}, () => {
          if (onAnimationComplete) {
            runOnJS(onAnimationComplete)();
          }
        }),
      );
    }
  }, [isLiked]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Heart
        size={24}
        color={isLiked ? AppColors.secondary : AppColors.gray600}
        fill={isLiked ? AppColors.secondary : 'transparent'}
      />
    </Animated.View>
  );
};

export default HeartAnimation;
