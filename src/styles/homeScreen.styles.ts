import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: Platform.OS === 'android' ? 25 : 0, // 📌 Ajuste para la barra de estado en Android
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 20,
    //fontWeight: 'bold',
    marginBottom: 20,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },

  card: {
    width: '48%', // 📌 Permite que entren dos tarjetas por fila
    aspectRatio: 1, // 📌 Mantiene la proporción cuadrada
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    elevation: 3,
    marginVertical: 10, // 📌 Espaciado vertical entre tarjetas
  },

  cardText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 10,
  },
});
