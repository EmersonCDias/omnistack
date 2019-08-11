import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'

import logo from '../assets/logo.png'
import dislike from '../assets/dislike.png'
import like from '../assets/like.png'
import api from '../services/api'

export default function Main({ navigation }) {
  const id = navigation.getParam('user')
  const [users, setUsers] = useState([])
  const [loading, handleLoading] = useState(true)

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get('/devs', {
        headers: {
          user: id,
        }
      })

      setUsers(response.data)
      handleLoading(false)
    }

    loadUsers()
  }, [id])

  async function handleDislike() {
    const [{ _id }, ...rest] = users

    api.post(`/devs/${_id}/dislikes`, null, {
      headers: { user: id }
    })

    setUsers(rest)
  }

  async function handleLike() {
    const [{ _id }, ...rest] = users

    api.post(`/devs/${_id}/likes`, null, {
      headers: { user: id }
    })

    setUsers(rest)
  }

  async function handleLogout() {
    await AsyncStorage.clear()

    navigation.navigate('Login')
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handleLogout}>
        <Image style={styles.logo} source={logo} />
      </TouchableOpacity>

      <View style={styles.cardsContainer}>
        {loading
          ? <Text style={styles.loading}>Carregando</Text>
          : users.length === 0
            ? <Text style={styles.empty}>Acabou</Text>
            : (
              users.map((user, index) => (
                <View key={index.toString()} style={[styles.card, { zIndex: users.length - index }]}>
                  <Image style={styles.avatar} source={{ uri: user.avatar }} />
      
                  <View style={styles.footer}>
                    <Text style={styles.name}>{user.name}</Text>
      
                    <Text style={styles.bio} numberOfLines={3}>{user.bio}</Text>
                  </View>
                </View>
              ))
            )
        }
      </View>
      
      {users.length > 0 
        && (
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={handleDislike} style={styles.button}>
              <Image source={dislike} />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLike}  style={styles.button}>
              <Image source={like} />
            </TouchableOpacity>
          </View>
        )
      }
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  logo: {
    marginTop: 30,
  },

  cardsContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    maxHeight: 500,
  }, 

  card: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    margin: 30,
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0, 
  },

  avatar: {
    flex: 1,
    height: 300,
  },

  footer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  bio: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
    marginTop: 2,
  },

  buttonsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },

  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  empty: {
    alignSelf: 'center',
    color: '#999',
    fontSize: 24,
    fontWeight: 'bold',
  },

  loading: {
    alignSelf: 'center',
    color: '#999',
    fontSize: 24,
    fontWeight: 'bold',
  }
})
