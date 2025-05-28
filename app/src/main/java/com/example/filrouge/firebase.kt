package com.example.filrouge.firebase

import com.google.firebase.auth.FirebaseAuth

object FirebaseManager {
    val auth: FirebaseAuth = FirebaseAuth.getInstance()

    fun isUserLoggedIn(): Boolean = auth.currentUser != null
}
