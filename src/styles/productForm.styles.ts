import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  buttonContainer: {
    marginTop: 10,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
  },
  
  imageButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  
  imageButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  
  dateButton: {
    backgroundColor: '#FF9500',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  
  dateButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },  
  numericContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 15,
  },
  numericInput: {
    flex: 1,
    textAlign: 'center',
  },
  numericButton: {
    padding: 5,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  numericButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
