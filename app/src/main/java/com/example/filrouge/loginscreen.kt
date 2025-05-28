package com.example.filrouge.screens

import android.widget.Toast
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import android.util.Patterns
import com.example.filrouge.firebase.FirebaseManager

@Composable
fun LoginScreen(onLoginSuccess: () -> Unit) {
    val context = LocalContext.current
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var emailError by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(32.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(text = "Connexion", style = MaterialTheme.typography.headlineMedium)

        Spacer(modifier = Modifier.height(24.dp))

        OutlinedTextField(
            value = email,
            onValueChange = {
                email = it
                emailError = false
            },
            label = { Text("Email") },
            isError = emailError,
            modifier = Modifier.fillMaxWidth()
        )
        if (emailError) {
            Text(
                text = "Adresse email invalide",
                color = MaterialTheme.colorScheme.error,
                style = MaterialTheme.typography.bodySmall,
                modifier = Modifier.align(Alignment.Start)
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Mot de passe") },
            visualTransformation = PasswordVisualTransformation(),
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = {
                if (email.isBlank() || password.isBlank()) {
                    Toast.makeText(context, "Champs requis", Toast.LENGTH_SHORT).show()
                    return@Button
                }
                if (!Patterns.EMAIL_ADDRESS.matcher(email.trim()).matches()) {
                    emailError = true
                    return@Button
                }
                FirebaseManager.auth.signInWithEmailAndPassword(email.trim(), password)
                    .addOnSuccessListener {
                        Toast.makeText(context, "Connecté avec succès", Toast.LENGTH_SHORT).show()
                        onLoginSuccess()
                    }
                    .addOnFailureListener {
                        Toast.makeText(context, "Erreur : ${it.message}", Toast.LENGTH_SHORT).show()
                    }
            },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Se connecter")
        }

        Spacer(modifier = Modifier.height(12.dp))

        TextButton(onClick = {
            if (email.isBlank() || password.isBlank()) {
                Toast.makeText(context, "Champs requis", Toast.LENGTH_SHORT).show()
                return@TextButton
            }
            if (!Patterns.EMAIL_ADDRESS.matcher(email.trim()).matches()) {
                emailError = true
                return@TextButton
            }
            FirebaseManager.auth.createUserWithEmailAndPassword(email.trim(), password)
                .addOnSuccessListener {
                    Toast.makeText(context, "Inscription réussie", Toast.LENGTH_SHORT).show()
                    onLoginSuccess()
                }
                .addOnFailureListener {
                    Toast.makeText(context, "Erreur : ${it.message}", Toast.LENGTH_SHORT).show()
                }
        }) {
            Text("S'inscrire")
        }
    }
}
