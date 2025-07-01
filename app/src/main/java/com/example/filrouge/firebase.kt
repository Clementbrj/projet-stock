package com.example.filrouge.firebase

import com.google.firebase.auth.FirebaseAuth
import kotlinx.coroutines.tasks.await
/* -------------
* UserController
-------------- */

object FirebaseManager {
    val auth: FirebaseAuth = FirebaseAuth.getInstance()

    fun isUserLoggedIn(): Boolean = auth.currentUser != null

    suspend fun getToken(): String? {
        return try {
            auth.currentUser?.getIdToken(true)?.await()?.token
        } catch (e: Exception) {
            null
        }
    }
}
