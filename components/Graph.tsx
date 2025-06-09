import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '../utils/theme';

interface GraphProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
    }[];
  };
}

const Graph: React.FC<GraphProps> = ({ data }) => {
  const { isDark } = useTheme();
  const screenWidth = Dimensions.get('window').width - 32; // Account for padding

  const chartConfig = {
    backgroundColor: isDark ? '#000' : '#fff',
    backgroundGradientFrom: isDark ? '#000' : '#fff',
    backgroundGradientTo: isDark ? '#000' : '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: isDark ? '#fff' : '#000',
    },
    propsForBackgroundLines: {
      stroke: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    },
  };

  return (
    <View style={styles.container}>
      <LineChart
        data={data}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withDots={true}
        withInnerLines={true}
        withOuterLines={true}
        withVerticalLines={false}
        withHorizontalLines={true}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        fromZero={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default Graph; 