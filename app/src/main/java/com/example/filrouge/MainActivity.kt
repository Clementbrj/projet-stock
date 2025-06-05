package com.example.filrouge

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.filrouge.firebase.FirebaseManager
import com.example.filrouge.screens.LoginScreen
import com.example.filrouge.ui.theme.FilrougeTheme
import com.google.firebase.FirebaseApp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        FirebaseApp.initializeApp(this)

        setContent {
            FilrougeTheme {
                Surface {
                    MainContent()
                }
            }
        }
    }
}

@Composable
fun MainContent() {
    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = if (FirebaseManager.isUserLoggedIn()) "stock" else "login"
    ) {
        composable("login") {
            LoginScreen(onLoginSuccess = {
                navController.navigate("stock") {
                    popUpTo("login") { inclusive = true }
                }
            })
        }
        composable("stock") {
            StockScreen(navController = navController)
        }
    }
}
