package com.example.filrouge.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Logout
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.google.firebase.auth.FirebaseAuth

// Exemple de données simulées
data class Produit(val nom: String, val quantite: Int, val valeur: String)

val produitsSimules = listOf(
    Produit("Produit A", 10, "Lorem ipsum dolor sit amet"),
    Produit("Produit B", 5, "Consectetur adipiscing elit"),
    Produit("Produit C", 20, "Sed do eiusmod tempor"),
    Produit("Produit D", 7, "Incididunt ut labore et dolore")
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StockScreen(
    navController: NavController,
    auth: FirebaseAuth = FirebaseAuth.getInstance()  // récupère instance Firebase Auth
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Gestion de stock") },
                actions = {
                    IconButton(
                        onClick = {
                            // Déconnexion Firebase
                            auth.signOut()
                            // Redirection vers page connexion (nom de la route à adapter)
                            navController.navigate("login") {
                                // Evite de revenir à l'écran stock en arrière
                                popUpTo("stock") { inclusive = true }
                            }
                        }
                    ) {
                        Icon(Icons.Default.Logout, contentDescription = "Déconnexion")
                    }
                }
            )
        },
        content = { paddingValues ->
            LazyColumn(
                contentPadding = paddingValues,
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp)
            ) {
                items(produitsSimules) { produit ->
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text(text = "Produit :", fontWeight = FontWeight.Bold)
                            Text(text = produit.nom)
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(text = "Qté :", fontWeight = FontWeight.Bold)
                            Text(text = produit.quantite.toString())
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(text = "Valeur :", fontWeight = FontWeight.Bold)
                            Text(text = produit.valeur)
                        }
                    }
                }
            }
        }
    )
}
