import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import DatabaseService from '../db/DatabaseServices';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faUsers,
  faFileLines,
  faCircleCheck,
  faCirclePause,
  faUser,
  faFile,
  faCirclePlus,
  faAngleRight,
  faAngleLeft
} from '@fortawesome/free-solid-svg-icons';
import TextUI from '../components/TextUI';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons/faPlusCircle';
interface DashboardStats {
  totalUsers: number;
  totalContracts: number;
  activeUsers: number;
  inactiveUsers: number;
}

const AdminDashboard = ({ navigation }: any) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalContracts: 0,
    activeUsers: 0,
    inactiveUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardStats();

    const unsubscribe = navigation.addListener('focus', () => {
      loadDashboardStats();
    });

    return unsubscribe;
  }, [navigation]);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const dashboardStats = await DatabaseService.getDashboardStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardStats();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0C64AE" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ padding: 8 }}
          >
            <FontAwesomeIcon icon={faAngleLeft} size={20} />
          </TouchableOpacity>

          <TextUI text="Admin Dashboard" style={styles.headerTitle} />
        </View>
        <TextUI
          text="Overview of your system"
          style={[styles.headerSubtitle, { marginLeft: 45 }]}
        />
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, styles.primaryCard]}>
          <View style={styles.statIcon}>
            <FontAwesomeIcon icon={faUsers as IconProp} size={24} />
          </View>
          <TextUI text={String(stats.totalUsers)} style={styles.statValue} />
          <TextUI text="Total Users" style={styles.statLabel} />
        </View>

        <View style={[styles.statCard, styles.successCard]}>
          <View style={styles.statIcon}>
            <FontAwesomeIcon icon={faFile as IconProp} size={24} />
          </View>
          <TextUI text={String(stats.totalContracts)} style={styles.statValue} />
          <TextUI text="Total Contracts" style={styles.statLabel} />
        </View>

        <View style={[styles.statCard, styles.infoCard]}>
          <View style={styles.statIcon}>
            <FontAwesomeIcon icon={faUser as IconProp} size={24} />
          </View>
          <TextUI text={String(stats.activeUsers)} style={styles.statValue} />
          <TextUI text="Active Users" style={styles.statLabel} />
        </View>

        <View style={[styles.statCard, styles.warningCard]}>
          <View style={styles.statIcon}>
            <FontAwesomeIcon icon={faCirclePause as IconProp} size={24} />
          </View>
          <TextUI text={String(stats.inactiveUsers)} style={styles.statValue} />
          <TextUI text="Inactive Users" style={styles.statLabel} />
        </View>
      </View>

      <View style={styles.section}>
        <TextUI text="Quick Actions" style={styles.sectionTitle} />

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('UserManagement')}
        >
          <View style={styles.actionIconContainer}>
            <FontAwesomeIcon icon={faUser as IconProp} size={24} />
          </View>
          <View style={styles.actionContent}>
            <TextUI text="Manage Users" style={styles.actionTitle} />
            <TextUI
              text="Add, edit, or remove users"
              style={styles.actionSubtitle}
            />
          </View>
          <FontAwesomeIcon icon={faAngleRight as IconProp} size={10} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('ContractsScreen')}
        >
          <View style={styles.actionIconContainer}>
            <FontAwesomeIcon icon={faFile as IconProp} size={24} />
          </View>
          <View style={styles.actionContent}>
            <TextUI text="View Contracts" style={styles.actionTitle} />
            <TextUI
              text="Browse all contracts"
              style={styles.actionSubtitle}
            />
          </View>
          <FontAwesomeIcon icon={faAngleRight as IconProp} size={10} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('AddForm')}
        >
          <View style={styles.actionIconContainer}>
            <FontAwesomeIcon icon={faPlusCircle as IconProp} size={24} />
          </View>
          <View style={styles.actionContent}>
            <TextUI text="Create Contract" style={styles.actionTitle} />
            <TextUI
              text="Add a new contract"
              style={styles.actionSubtitle}
            />
          </View>
          <FontAwesomeIcon icon={faAngleRight as IconProp} size={10} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  primaryCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#0C64AE',
  },
  successCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  infoCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#6366F1',
  },
  warningCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statIconText: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  actionArrow: {
    fontSize: 24,
    color: '#9CA3AF',
  },
});

export default AdminDashboard;