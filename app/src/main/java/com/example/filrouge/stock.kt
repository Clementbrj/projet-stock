package com.example.filrouge

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Logout
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import com.google.firebase.auth.FirebaseAuth
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

/* -------------
* Structure des données à récupérer
-------------- */

data class Stock(
    val id: Int = 0,
    val id_entrepot: Int? = null,
    val id_produit: Int? = null,
    val quantite: Int? = null,
    val valeur: Float? = null,
    val date_maj: String? = null,
    val entrepot: Entrepot? = null,
    val produit: Produit? = null
)

data class Entrepot(
    val id: Int,
    val nom: String
)

data class Produit(
    val id: Int,
    val nom: String
)

data class StockUpdateRequest(
    val quantite: Int?,
    val valeur: Float?
)

/* -------------
* UI
-------------- */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StockScreen(
    navController: NavController,
    auth: FirebaseAuth = FirebaseAuth.getInstance(),
    stockViewModel: StockViewModel = viewModel()
) {
    // Var de suivi d'état (équivalent UseState)
    val stocks by stockViewModel.stocks.collectAsState()
    val entrepots by stockViewModel.entrepots.collectAsState()

    var selectedEntrepotId by remember { mutableStateOf<Int?>(null) }
    var editingStock by remember { mutableStateOf(Stock()) }
    var newQuantite by remember { mutableStateOf("") }
    var showEditDialog by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        stockViewModel.fetchAll()
    }

    // DATE !!! MARCHE PAS
    fun formatDate(dateString: String?): String {
        return try {
            val formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME
            val dateTime = LocalDateTime.parse(dateString, formatter)
            val outputFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")
            dateTime.format(outputFormatter)
        } catch (e: Exception) {
            "N/A"
        }
    }

    // UI
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("StockManager") },
                actions = {
                    IconButton(
                        onClick = {
                            auth.signOut()
                            navController.navigate("login") {
                                popUpTo("stock") { inclusive = true }
                            }
                        }
                    ) {
                        Icon(Icons.AutoMirrored.Filled.Logout, contentDescription = "Déconnexion")
                    }
                }
            )
        },
        content = { paddingValues ->
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .padding(16.dp)
            ) {
                if (entrepots.isNotEmpty()) {
                    var expanded by remember { mutableStateOf(false) }

                    ExposedDropdownMenuBox(
                        expanded = expanded,
                        onExpandedChange = { expanded = !expanded }
                    ) {
                        TextField(
                            value = entrepots.find { it.id == selectedEntrepotId }?.nom ?: "Choisir un entrepôt",
                            onValueChange = {},
                            readOnly = true,
                            label = { Text("Entrepôt") },
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
                            modifier = Modifier.menuAnchor()
                        )

                        ExposedDropdownMenu(
                            expanded = expanded,
                            onDismissRequest = { expanded = false }
                        ) {
                            entrepots.forEach { entrepot ->
                                DropdownMenuItem(
                                    text = { Text(entrepot.nom) },
                                    onClick = {
                                        selectedEntrepotId = entrepot.id
                                        expanded = false
                                    }
                                )
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                if (selectedEntrepotId != null) {
                    val filteredStocks = stocks.filter { it.id_entrepot == selectedEntrepotId }

                    if (filteredStocks.isEmpty()) {
                        Text("Aucun produit dans cet entrepôt.")
                    } else {
                        LazyColumn(
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            items(filteredStocks) { stock ->
                                Card(
                                    modifier = Modifier.fillMaxWidth(),
                                    elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
                                ) {
                                    Row(
                                        modifier = Modifier
                                            .padding(16.dp)
                                            .fillMaxWidth(),
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        Column {
                                            Text(
                                                "Produit : ${stock.produit?.nom ?: "N/A"}",
                                                fontWeight = FontWeight.Bold
                                            )
                                            Text("Quantité : ${stock.quantite ?: 0}")
                                            Text("Valeur unitaire : ${stock.valeur ?: 0f} €")
                                            Text("Dernière mise à jour : ${formatDate(stock.date_maj)}")
                                        }

                                        Box(
                                            modifier = Modifier
                                                .background(Color.Blue, shape = CircleShape)
                                                .clickable {
                                                    editingStock = stock
                                                    newQuantite = stock.quantite?.toString() ?: ""
                                                    showEditDialog = true
                                                }
                                                .padding(8.dp),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Text(
                                                text = "MAJ",
                                                fontSize = 16.sp,
                                                color = Color.White,
                                                modifier = Modifier.padding(horizontal = 8.dp)
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    Text("Veuillez sélectionner un entrepôt.")
                }
            }

            if (showEditDialog) {
                AlertDialog(
                    onDismissRequest = { showEditDialog = false },
                    title = { Text("Modifier la quantité") },
                    text = {
                        Column {
                            Text("Produit: ${editingStock.produit?.nom ?: "N/A"}")
                            OutlinedTextField(
                                value = newQuantite,
                                onValueChange = { input ->
                                    if (input.all { it.isDigit() }) {
                                        newQuantite = input
                                    }
                                },
                                label = { Text("Quantité") },
                                singleLine = true,
                                modifier = Modifier.fillMaxWidth()
                            )
                        }
                    },
                    confirmButton = {
                        TextButton(
                            onClick = {
                                val quantiteInt = newQuantite.toIntOrNull()
                                if (quantiteInt != null) {
                                    stockViewModel.updateStock(editingStock.id, quantiteInt, null)
                                    stockViewModel.fetchStocks() // Recharge les stocks après mise à jour
                                    showEditDialog = false
                                }
                            }
                        ) {
                            Text("Valider")
                        }
                    },
                    dismissButton = {
                        TextButton(onClick = { showEditDialog = false }) {
                            Text("Annuler")
                        }
                    }
                )
            }
        }
    )
}
