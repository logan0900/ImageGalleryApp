import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Eye, EyeOff, User, Mail, Phone, Lock } from 'lucide-react-native';
import AppColors from '../theme/AppColors';

type RegistrationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Registration'
>;

interface Props {
  navigation: RegistrationScreenNavigationProp;
}

const RegistrationSchema = Yup.object().shape({
  name: Yup.string().required('Full name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^\d{10}$/, 'Phone must be exactly 10 digits')
    .required('Phone number is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const RegistrationScreen: React.FC<Props> = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
    },
    validationSchema: RegistrationSchema,
    onSubmit: values => {
      console.log(values);
      navigation.navigate('Gallery');
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      style={styles.flex1}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome!</Text>
          <Text style={styles.subtitle}>Create your account to continue</Text>
        </View>

        <View style={styles.form}>
          {/* Name Field */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Full Name</Text>
            <View
              style={[
                styles.inputContainer,
                formik.touched.name && formik.errors.name && styles.inputError,
              ]}
            >
              <User size={20} color={AppColors.textMuted} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor={AppColors.textMuted}
                onChangeText={formik.handleChange('name')}
                onBlur={formik.handleBlur('name')}
                value={formik.values.name}
              />
            </View>
            {formik.touched.name && formik.errors.name && (
              <Text style={styles.errorText}>{formik.errors.name}</Text>
            )}
          </View>

          {/* Email Field */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Email Address</Text>
            <View
              style={[
                styles.inputContainer,
                formik.touched.email &&
                  formik.errors.email &&
                  styles.inputError,
              ]}
            >
              <Mail size={20} color={AppColors.textMuted} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="john@example.com"
                placeholderTextColor={AppColors.textMuted}
                onChangeText={formik.handleChange('email')}
                onBlur={formik.handleBlur('email')}
                value={formik.values.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {formik.touched.email && formik.errors.email && (
              <Text style={styles.errorText}>{formik.errors.email}</Text>
            )}
          </View>

          {/* Phone Field */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Phone Number</Text>
            <View
              style={[
                styles.inputContainer,
                formik.touched.phone &&
                  formik.errors.phone &&
                  styles.inputError,
              ]}
            >
              <Phone
                size={20}
                color={AppColors.textMuted}
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="1234567890"
                placeholderTextColor={AppColors.textMuted}
                onChangeText={formik.handleChange('phone')}
                onBlur={formik.handleBlur('phone')}
                value={formik.values.phone}
                keyboardType="numeric"
              />
            </View>
            {formik.touched.phone && formik.errors.phone && (
              <Text style={styles.errorText}>{formik.errors.phone}</Text>
            )}
          </View>

          {/* Password Field */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password</Text>
            <View
              style={[
                styles.inputContainer,
                formik.touched.password &&
                  formik.errors.password &&
                  styles.inputError,
              ]}
            >
              <Lock size={20} color={AppColors.textMuted} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#999"
                onChangeText={formik.handleChange('password')}
                onBlur={formik.handleBlur('password')}
                value={formik.values.password}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                {showPassword ? (
                  <EyeOff size={20} color={AppColors.icon} />
                ) : (
                  <Eye size={20} color={AppColors.icon} />
                )}
              </TouchableOpacity>
            </View>
            {formik.touched.password && formik.errors.password && (
              <Text style={styles.errorText}>{formik.errors.password}</Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => formik.handleSubmit()}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  container: {
    padding: 24,
    flexGrow: 1,
    backgroundColor: AppColors.white,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: AppColors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.icon,
    marginTop: 8,
  },
  form: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.gray700,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.gray100,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputError: {
    borderColor: AppColors.error,
    backgroundColor: AppColors.errorLight,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: AppColors.text,
    height: '100%',
  },
  eyeIcon: {
    padding: 8,
  },
  errorText: {
    color: AppColors.error,
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: '500',
  },
  button: {
    backgroundColor: AppColors.primary,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: AppColors.white,
    fontSize: 18,
    fontWeight: '700',
  },
});

export default RegistrationScreen;
