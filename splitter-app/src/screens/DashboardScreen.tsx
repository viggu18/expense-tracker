import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';
import { balanceService } from '../services/balance.service';
import { analyticsService } from '../services/analytics.service';
import { formatCurrency } from '../utils/format';
import { useStore } from '../store/useStore';
import { getCurrentTheme } from '../services/theme.service';
import Screen from '../components/Screen';

const DashboardScreen = () => {
  const [balances, setBalances] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const { user } = useStore();

  const fetchDashboardData = async () => {
    try {
      const [balancesData, analyticsData] = await Promise.all([
        balanceService.getBalances(),
        analyticsService.getGlobalAnalytics(),
      ]);

      setBalances(balancesData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const theme = getCurrentTheme();

  return (
    <Screen scroll>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={[styles.welcomeText, { color: theme.textPrimary }]}>
          Welcome, {user?.name || 'User'}!
        </Text>

        {/* Balance Summary Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.cardBackground,
              shadowColor: theme.shadow,
            },
          ]}
        >
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
            Your Balance
          </Text>
          <Text
            style={[
              styles.balanceAmount,
              balances?.overallBalance >= 0 ? styles.positive : styles.negative,
            ]}
          >
            {balances ? formatCurrency(balances.overallBalance) : 'Loading...'}
          </Text>
          <Text
            style={[styles.balanceDescription, { color: theme.textSecondary }]}
          >
            {balances?.overallBalance >= 0
              ? "You're owed this amount"
              : 'You owe this amount'}
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Quick Actions
          </Text>
          <View style={styles.buttonRow}>
            <Button
              title="Add Expense"
              onPress={() => {
                // @ts-ignore
                navigation.navigate('AddExpense', { group: null });
              }}
              style={styles.actionButton}
            />
            <Button
              title="Settle Up"
              variant="secondary"
              onPress={() => navigation.navigate('Balances' as never)}
              style={styles.actionButton}
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Recent Activity
          </Text>
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.cardBackground,
                shadowColor: theme.shadow,
              },
            ]}
          >
            <Text
              style={[styles.placeholderText, { color: theme.textTertiary }]}
            >
              No recent activity
            </Text>
          </View>
        </View>

        {/* Spending Overview */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Spending Overview
          </Text>
          {analytics ? (
            <View
              style={[
                styles.card,
                {
                  backgroundColor: theme.cardBackground,
                  shadowColor: theme.shadow,
                },
              ]}
            >
              <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
                Total Expenses
              </Text>
              <Text style={[styles.amount, { color: theme.textPrimary }]}>
                {formatCurrency(analytics.totalExpenses)}
              </Text>

              <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
                Top Categories
              </Text>
              {Object.entries(analytics.categorySpending).length > 0 ? (
                Object.entries(analytics.categorySpending).map(
                  ([category, amount]) => (
                    <View
                      key={category}
                      style={[
                        styles.categoryRow,
                        { borderBottomColor: theme.border },
                      ]}
                    >
                      <Text style={{ color: theme.textPrimary }}>
                        {category}
                      </Text>
                      <Text style={{ color: theme.textPrimary }}>
                        {formatCurrency(amount as number)}
                      </Text>
                    </View>
                  )
                )
              ) : (
                <Text
                  style={[
                    styles.placeholderText,
                    { color: theme.textTertiary },
                  ]}
                >
                  No spending data
                </Text>
              )}
            </View>
          ) : (
            <View
              style={[
                styles.card,
                {
                  backgroundColor: theme.cardBackground,
                  shadowColor: theme.shadow,
                },
              ]}
            >
              <Text
                style={[styles.placeholderText, { color: theme.textTertiary }]}
              >
                Loading analytics...
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  positive: {
    color: '#4CD964',
  },
  negative: {
    color: '#FF3B30',
  },
  balanceDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  placeholderText: {
    textAlign: 'center',
    padding: 20,
  },
});

export default DashboardScreen;
