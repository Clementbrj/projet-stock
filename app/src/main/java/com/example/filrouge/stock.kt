package com.example.filrouge

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Logout
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
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
* Notifications locales
-------------- */

fun createNotificationChannel(context: Context) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        val name = "Ruptures de stock"
        val descriptionText = "Notifications pour les produits en rupture"
        val importance = NotificationManager.IMPORTANCE_HIGH
        val channel = NotificationChannel("stock_channel", name, importance).apply {
            description = descriptionText
        }
        val notificationManager: NotificationManager =
            context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.createNotificationChannel(channel)
    }
}

fun sendStockNotification(context: Context, produitNom: String) {
    val builder = NotificationCompat.Builder(context, "stock_channel")
        .setSmallIcon(android.R.drawable.ic_dialog_alert)
        .setContentTitle("Rupture de stock")
        .setContentText("Le produit \"$produitNom\" est en rupture !")
        .setPriority(NotificationCompat.PRIORITY_HIGH)

    with(NotificationManagerCompat.from(context)) {
        notify(produitNom.hashCode(), builder.build())
    }
}

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
    val stocks by stockViewModel.stocks.collectAsState()
    val entrepots by stockViewModel.entrepots.collectAsState()

    var selectedEntrepotId by remember { mutableStateOf<Int?>(null) }
    var editingStock by remember { mutableStateOf(Stock()) }
    var newQuantite by remember { mutableStateOf("") }
    var showEditDialog by remember { mutableStateOf(false) }
    var showNotificationDialog by remember { mutableStateOf(false) }

    val context = LocalContext.current

    // Historique des notifications de rupture
    val ruptureHistorique = remember { mutableStateListOf<Pair<String, String>>() }

    LaunchedEffect(Unit) {
        createNotificationChannel(context)
        stockViewModel.fetchAll()
    }

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

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("StockManager") },
                actions = {
                    // Icône notifications
                    IconButton(onClick = { showNotificationDialog = true }) {
                        Icon(Icons.Default.Notifications, contentDescription = "Notifications")
                    }

                    // Icône déconnexion
                    IconButton(onClick = {
                        auth.signOut()
                        navController.navigate("login") {
                            popUpTo("stock") { inclusive = true }
                        }
                    }) {
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

                    // Notifications pour produits à 0 (évite les doublons)
                    filteredStocks.filter { it.quantite == 0 }.forEach { stock ->
                        stock.produit?.nom?.let { produitNom ->
                            val entrepotNom = stock.entrepot?.nom ?: "Inconnu"
                            val produitEtEntrepot = produitNom to entrepotNom

                            if (!ruptureHistorique.contains(produitEtEntrepot)) {
                                sendStockNotification(context, produitNom)
                                ruptureHistorique.add(produitEtEntrepot)
                            }

                        }
                    }

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

            // Boîte de dialogue pour modifier la quantité
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
                                    stockViewModel.fetchStocks()
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

            // Boîte de dialogue pour afficher l’historique des notifications
            if (showNotificationDialog) {
                AlertDialog(
                    onDismissRequest = { showNotificationDialog = false },
                    title = { Text("Historique des ruptures") },
                    text = {
                        if (ruptureHistorique.isEmpty()) {
                            Text("Aucune rupture signalée.")
                        } else {
                            Column {
                                ruptureHistorique.forEach { (produitNom, entrepotNom) ->
                                    Text("- $produitNom ,Entrepôt : $entrepotNom")
                                }
                            }
                        }
                    },
                    confirmButton = {
                        TextButton(onClick = { showNotificationDialog = false }) {
                            Text("Fermer")
                        }
                    }
                )
            }
        }
    )
}

