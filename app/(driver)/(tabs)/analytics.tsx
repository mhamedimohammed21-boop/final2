import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Calendar, Clock, Star, Target, Award, Users, MapPin } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function DriverAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const analyticsData = {
    week: {
      totalEarnings: 892.30,
      totalTrips: 47,
      averageRating: 4.8,
      acceptanceRate: 92,
      completionRate: 98,
      onlineHours: 32.5,
      peakHours: ['7-9 AM', '5-7 PM'],
      topAreas: ['Downtown', 'Airport', 'University'],
    },
    month: {
      totalEarnings: 3456.80,
      totalTrips: 189,
      averageRating: 4.7,
      acceptanceRate: 89,
      completionRate: 96,
      onlineHours: 128.5,
      peakHours: ['7-9 AM', '5-7 PM', '10-12 PM'],
      topAreas: ['Downtown', 'Airport', 'Mall District'],
    }
  };

  const currentData = analyticsData[selectedPeriod as keyof typeof analyticsData];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Analytics</Text>
        <TouchableOpacity style={styles.exportButton}>
          <Text style={styles.exportButtonText}>Export</Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <Animated.View style={[styles.periodSelector, { opacity: fadeAnim }]}>
          {['week', 'month'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.activePeriodButton,
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.activePeriodButtonText,
              ]}>
                This {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Performance Overview */}
        <Animated.View style={[styles.overviewSection, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Performance Overview</Text>
          
          <View style={styles.overviewGrid}>
            <View style={styles.overviewCard}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.overviewGradient}
              >
                <Text style={styles.overviewValue}>{currentData.acceptanceRate}%</Text>
                <Text style={styles.overviewLabel}>Acceptance Rate</Text>
                <View style={styles.overviewIcon}>
                  <Target size={20} color="#FFFFFF" />
                </View>
              </LinearGradient>
            </View>
            
            <View style={styles.overviewCard}>
              <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                style={styles.overviewGradient}
              >
                <Text style={styles.overviewValue}>{currentData.completionRate}%</Text>
                <Text style={styles.overviewLabel}>Completion Rate</Text>
                <View style={styles.overviewIcon}>
                  <Award size={20} color="#FFFFFF" />
                </View>
              </LinearGradient>
            </View>
          </View>
        </Animated.View>

        {/* Rating Trends */}
        <Animated.View style={[styles.ratingSection, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Rating & Feedback</Text>
          
          <View style={styles.ratingCard}>
            <View style={styles.ratingHeader}>
              <View style={styles.ratingDisplay}>
                <Star size={32} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.ratingValue}>{currentData.averageRating}</Text>
              </View>
              <View style={styles.ratingStats}>
                <Text style={styles.ratingStatsText}>Based on {currentData.totalTrips} trips</Text>
                <Text style={styles.ratingTrend}>↗ +0.1 from last {selectedPeriod}</Text>
              </View>
            </View>
            
            <View style={styles.ratingBreakdown}>
              {[5, 4, 3, 2, 1].map((stars) => (
                <View key={stars} style={styles.ratingRow}>
                  <Text style={styles.ratingStars}>{stars}★</Text>
                  <View style={styles.ratingBar}>
                    <View 
                      style={[
                        styles.ratingBarFill, 
                        { width: `${stars === 5 ? 85 : stars === 4 ? 12 : 3}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.ratingPercentage}>
                    {stars === 5 ? '85%' : stars === 4 ? '12%' : '3%'}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* Peak Hours */}
        <Animated.View style={[styles.peakSection, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Peak Hours</Text>
          
          <View style={styles.peakCard}>
            <View style={styles.peakHeader}>
              <Clock size={20} color="#F59E0B" />
              <Text style={styles.peakTitle}>Best earning times</Text>
            </View>
            <View style={styles.peakHours}>
              {currentData.peakHours.map((hour, index) => (
                <View key={index} style={styles.peakHourItem}>
                  <Text style={styles.peakHourText}>{hour}</Text>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* Top Areas */}
        <Animated.View style={[styles.areasSection, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Top Pickup Areas</Text>
          
          <View style={styles.areasCard}>
            {currentData.topAreas.map((area, index) => (
              <View key={index} style={styles.areaItem}>
                <View style={styles.areaRank}>
                  <Text style={styles.areaRankText}>{index + 1}</Text>
                </View>
                <View style={styles.areaInfo}>
                  <Text style={styles.areaName}>{area}</Text>
                  <Text style={styles.areaTrips}>
                    {Math.floor(currentData.totalTrips * (0.3 - index * 0.08))} trips
                  </Text>
                </View>
                <MapPin size={16} color="#6B7280" />
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  exportButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  exportButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 20,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activePeriodButton: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activePeriodButtonText: {
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  overviewSection: {
    marginBottom: 24,
  },
  overviewGrid: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
  },
  overviewCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  overviewGradient: {
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  overviewValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  overviewIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  ratingSection: {
    marginBottom: 24,
  },
  ratingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  ratingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    gap: 8,
  },
  ratingValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
  },
  ratingStats: {
    flex: 1,
  },
  ratingStatsText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  ratingTrend: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  ratingBreakdown: {
    gap: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ratingStars: {
    fontSize: 12,
    color: '#6B7280',
    width: 24,
  },
  ratingBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  ratingBarFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 3,
  },
  ratingPercentage: {
    fontSize: 12,
    color: '#6B7280',
    width: 32,
    textAlign: 'right',
  },
  peakSection: {
    marginBottom: 24,
  },
  peakCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  peakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  peakTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  peakHours: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  peakHourItem: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  peakHourText: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '600',
  },
  areasSection: {
    marginBottom: 40,
  },
  areasCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  areaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  areaRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  areaRankText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  areaInfo: {
    flex: 1,
  },
  areaName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  areaTrips: {
    fontSize: 12,
    color: '#6B7280',
  },
});