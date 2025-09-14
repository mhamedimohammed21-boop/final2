import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, FileText, User, Car, CircleCheck as CheckCircle, Circle as XCircle, Clock, Eye } from 'lucide-react-native';
import { router } from 'expo-router';

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadApplications();
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadApplications = () => {
    // Mock applications data
    const mockApplications = [
      {
        id: '1',
        full_name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1 (555) 123-4567',
        vehicle_type: 'economy',
        vehicle_year: '2022',
        vehicle_color: 'Silver',
        license_plate: 'ABC 123',
        status: 'pending',
        created_at: new Date().toISOString(),
        documents: {
          license_uploaded: true,
          insurance_uploaded: true,
          vehicle_registration_uploaded: false,
        }
      },
      {
        id: '2',
        full_name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+1 (555) 987-6543',
        vehicle_type: 'comfort',
        vehicle_year: '2021',
        vehicle_color: 'Black',
        license_plate: 'XYZ 789',
        status: 'under_review',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        documents: {
          license_uploaded: true,
          insurance_uploaded: true,
          vehicle_registration_uploaded: true,
        }
      },
    ];
    setApplications(mockApplications);
  };

  const handleApproveApplication = (applicationId: string) => {
    Alert.alert(
      'Approve Application',
      'Are you sure you want to approve this driver application?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: () => {
            Alert.alert('Success', 'Driver application approved successfully!');
            loadApplications();
          },
        },
      ]
    );
  };

  const handleRejectApplication = (applicationId: string) => {
    Alert.alert(
      'Reject Application',
      'Are you sure you want to reject this application?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Application Rejected', 'The applicant will be notified.');
            loadApplications();
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#F59E0B';
      case 'under_review':
        return '#3B82F6';
      case 'approved':
        return '#10B981';
      case 'rejected':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} color="#F59E0B" />;
      case 'under_review':
        return <Eye size={16} color="#3B82F6" />;
      case 'approved':
        return <CheckCircle size={16} color="#10B981" />;
      case 'rejected':
        return <XCircle size={16} color="#EF4444" />;
      default:
        return <Clock size={16} color="#6B7280" />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>Driver Applications</Text>
        <View style={styles.placeholder} />
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {applications.length === 0 ? (
          <View style={styles.emptyState}>
            <FileText size={48} color="#E5E7EB" />
            <Text style={styles.emptyStateText}>No pending applications</Text>
          </View>
        ) : (
          <View style={styles.applicationsList}>
            {applications.map((app: any) => (
              <View key={app.id} style={styles.applicationCard}>
                <View style={styles.applicationHeader}>
                  <View style={styles.applicantInfo}>
                    <View style={styles.applicantAvatar}>
                      <User size={20} color="#FFFFFF" />
                    </View>
                    <View style={styles.applicantDetails}>
                      <Text style={styles.applicantName}>{app.full_name}</Text>
                      <Text style={styles.applicantEmail}>{app.email}</Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(app.status) }]}>
                    {getStatusIcon(app.status)}
                    <Text style={styles.statusText}>{app.status.replace('_', ' ')}</Text>
                  </View>
                </View>

                <View style={styles.applicationDetails}>
                  <View style={styles.detailRow}>
                    <Car size={16} color="#6B7280" />
                    <Text style={styles.detailText}>
                      {app.vehicle_year} {app.vehicle_color} • {app.license_plate}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <FileText size={16} color="#6B7280" />
                    <Text style={styles.detailText}>
                      Documents: {Object.values(app.documents).filter(Boolean).length}/3 uploaded
                    </Text>
                  </View>
                </View>

                {app.status === 'pending' && (
                  <View style={styles.applicationActions}>
                    <TouchableOpacity
                      style={styles.rejectButton}
                      onPress={() => handleRejectApplication(app.id)}
                    >
                      <XCircle size={16} color="#FFFFFF" />
                      <Text style={styles.rejectButtonText}>Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.approveButton}
                      onPress={() => handleApproveApplication(app.id)}
                    >
                      <CheckCircle size={16} color="#FFFFFF" />
                      <Text style={styles.approveButtonText}>Approve</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
  },
  applicationsList: {
    paddingHorizontal: 24,
    gap: 16,
  },
  applicationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  applicantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  applicantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6B7280',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  applicantDetails: {
    flex: 1,
  },
  applicantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  applicantEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  applicationDetails: {
    marginBottom: 16,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
  },
  applicationActions: {
    flexDirection: 'row',
    gap: 12,
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  rejectButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  approveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  approveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});