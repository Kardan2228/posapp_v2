import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSearch = (text: string) => {
        setQuery(text);
        onSearch(text);
    };

    return (
        <View style={styles.container}>
            <Icon name="search" size={20} color="#888" style={styles.icon} />
            <TextInput
                style={styles.input}
                placeholder="Buscar producto..."
                value={query}
                onChangeText={handleSearch}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
        elevation: 2,
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        paddingVertical: 8,
    },
});

export default SearchBar;
